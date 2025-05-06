
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { format, parseISO, formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Calendar, Package, Info, MessageSquare, Send, User, Building, Bot, ClipboardCheck, Star, HandCoins, BadgePercent, Box, Weight, Tag } from 'lucide-react'; // Added icons

import type { Donation, Message } from '@/types/donation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TransactionValidation from './transaction-validation'; // Import for reuse

// Simple Mock Map Component
const MockMap: FC<{ location: string }> = ({ location }) => (
  <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center border border-border relative overflow-hidden shadow-inner">
     {/* Basic map representation */}
     <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 dark:from-green-900/30 dark:via-blue-950/30 dark:to-green-900/30 opacity-50"></div>
     <svg className="absolute inset-0 w-full h-full text-border/30 dark:text-border/20" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 10 H 100 M0 20 H 100 M0 30 H 100 M0 40 H 100 M0 50 H 100 M0 60 H 100 M0 70 H 100 M0 80 H 100 M0 90 H 100" stroke="currentColor" strokeWidth="0.2"/>
        <path d="M10 0 V 100 M20 0 V 100 M30 0 V 100 M40 0 V 100 M50 0 V 100 M60 0 V 100 M70 0 V 100 M80 0 V 100 M90 0 V 100" stroke="currentColor" strokeWidth="0.2"/>
      </svg>
    <div className="text-center z-10 p-4 bg-background/80 dark:bg-black/60 rounded-lg shadow-md backdrop-blur-sm">
        <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Ubicación de Recogida:</p>
        <p className="text-xs text-muted-foreground">{location}</p>
        <p className="text-xs mt-1 italic text-muted-foreground">(Mapa interactivo no disponible en esta demo)</p>
    </div>
  </div>
);


interface DonationDetailViewProps {
  donation: Donation;
  role: 'business' | 'organization'; // Current user's role
}

const DonationDetailView: FC<DonationDetailViewProps> = ({ donation, role }) => {
    const [messages, setMessages] = useState<Message[]>(donation.messages || []);
    const [newMessage, setNewMessage] = useState('');

    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return 'N/D';
        try {
            const dateObj = typeof date === 'string' ? parseISO(date) : date;
            if (isNaN(dateObj.getTime())) return 'Fecha Inválida';
            return format(dateObj, 'dd MMM, yyyy HH:mm', { locale: es });
        } catch { return 'Fecha inválida'; }
    };

    const formatRelativeDate = (date: Date | string | undefined): string => {
        if (!date) return 'hace un tiempo';
        try {
            const dateObj = typeof date === 'string' ? parseISO(date) : date;
            if (isNaN(dateObj.getTime())) return 'Fecha Inválida';
            return formatDistanceToNowStrict(dateObj, { addSuffix: true, locale: es });
        } catch { return 'Fecha inválida'; }
    };

     const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const messageToSend: Message = {
            id: `msg-${Date.now()}`, // Simple unique ID for demo
            sender: role, // Sender is the current user's role
            text: newMessage,
            timestamp: new Date(),
        };

        // Simulate sending message (add to local state)
        setMessages(prevMessages => [...prevMessages, messageToSend]);
        setNewMessage('');

        // TODO: In a real app, send this message to the backend
        console.log("Mensaje enviado (simulado):", messageToSend);
    };

    const getSenderAvatar = (sender: Message['sender']) => {
        switch (sender) {
            case 'business':
                return <AvatarFallback><Building className="h-4 w-4" /></AvatarFallback>;
            case 'organization':
                return <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>;
            case 'system':
                 return <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>;
            default:
                return <AvatarFallback>?</AvatarFallback>;
        }
    };

    const getSenderName = (sender: Message['sender']) => {
        switch (sender) {
            case 'business': return donation.postedBy;
            case 'organization': return donation.claimedBy || 'Organización';
            case 'system': return 'Sistema';
            default: return 'Desconocido';
        }
     }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Column: Donation Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg border-border/50 overflow-hidden">
           <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-card via-secondary/30 to-card dark:from-card dark:via-black/20 dark:to-card">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                    <div className="flex items-center gap-3">
                         {donation.photoUrl ? (
                            <div className="relative h-16 w-16 rounded-md overflow-hidden border-2 border-primary/50 shadow-md flex-shrink-0">
                             <Image
                               src={donation.photoUrl}
                               alt={`Foto de ${donation.itemName}`}
                               fill={true}
                               style={{ objectFit: 'cover' }}
                               sizes="64px"
                               data-ai-hint={donation['data-ai-hint'] || 'food item'}
                             />
                           </div>
                         ) : (
                            <div className="flex items-center justify-center h-16 w-16 rounded-md bg-secondary border border-border flex-shrink-0">
                                <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                            </div>
                         )}
                        <div>
                           <CardTitle className="text-xl font-bold text-foreground">{donation.itemName}</CardTitle>
                           <CardDescription className="text-sm text-muted-foreground mt-1">
                             Publicado por {donation.postedBy} {formatRelativeDate(donation.postedAt)}
                           </CardDescription>
                         </div>
                    </div>
                    {/* Updated Price Badge */}
                     <Badge variant={donation.isFree ? "secondary" : "outline"} className={`text-sm ${donation.isFree ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : 'border-orange-500 text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'} flex-shrink-0 mt-1 sm:mt-0 py-1 px-2.5`}>
                        {donation.isFree ? (
                            <><BadgePercent className="mr-1 h-4 w-4" /> Gratis</>
                        ) : (
                            <><HandCoins className="mr-1 h-4 w-4" /> MXN$ {donation.pricePerUnit?.toFixed(2)} / {donation.unit}</>
                        )}
                    </Badge>
                </div>

          </CardHeader>
          <CardContent className="p-4 sm:p-6 grid gap-4 text-sm">
             {donation.description && (
                 <p><span className="font-semibold">Descripción:</span> {donation.description}</p>
             )}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                 {/* Updated Quantity/Unit Display */}
                <p className="flex items-center gap-1.5">
                   <Box className="h-4 w-4 text-muted-foreground"/> <span className="font-semibold">Cantidad Total:</span> {donation.quantity} {donation.unit}
                </p>
                 {/* Expiration Date */}
                <p className="flex items-center gap-1.5">
                   <Calendar className="h-4 w-4 text-muted-foreground"/> <span className="font-semibold">Caducidad:</span> {formatDate(donation.expirationDate)}
                    <span className="text-muted-foreground text-xs ml-1">({formatRelativeDate(donation.expirationDate)})</span>
                </p>
                 {/* Posted Date */}
                 <p><span className="font-semibold">Publicado:</span> {formatDate(donation.postedAt)}</p>
                 {/* Claimed Date */}
                 {donation.claimedAt && (
                    <p><span className="font-semibold">Reclamado:</span> {formatDate(donation.claimedAt)} por {donation.claimedBy}</p>
                 )}
             </div>

            <Separator className="my-2"/>

            <div>
                <h4 className="font-semibold mb-2 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary"/> Detalles de Recogida</h4>
                <p><span className="font-medium">Ubicación:</span> {donation.pickupLocation}</p>
                 {donation.pickupInstructions && (
                    <p className="mt-1"><span className="font-medium">Instrucciones:</span> {donation.pickupInstructions}</p>
                 )}
                 {/* Mock Map */}
                <div className="mt-4">
                    <MockMap location={donation.pickupLocation} />
                </div>
            </div>


          </CardContent>
        </Card>

         {/* Validation/Rating Section */}
         {(donation.status === 'claimed' || donation.status === 'delivered') && (
            <Card className="shadow-lg border-border/50">
                 <CardHeader className="p-4 sm:p-6">
                     <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        {(role === 'organization' && donation.status === 'claimed') || (role === 'business' && donation.status === 'delivered') ? <Star className="h-5 w-5 text-primary"/> : <ClipboardCheck className="h-5 w-5 text-primary"/> }
                         {role === 'organization' ? 'Validación y Calificación' : 'Validación de Entrega'}
                     </CardTitle>
                      <CardDescription className="text-sm">
                         {role === 'organization' ? 'Valida la recogida y califica la calidad.' : 'Confirma que la donación ha sido entregada.'}
                     </CardDescription>
                 </CardHeader>
                 <CardContent className="p-4 sm:p-6">
                     <TransactionValidation donation={donation} role={role} />
                 </CardContent>
            </Card>
         )}

      </div>

      {/* Right Column: Messages */}
      <div className="lg:col-span-1">
        <Card className="shadow-lg border-border/50 h-full flex flex-col">
          <CardHeader className="p-4 sm:p-6 border-b">
            <CardTitle className="text-lg font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary"/> Mensajes</CardTitle>
             <CardDescription className="text-sm">Conversación sobre esta donación.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden">
             <ScrollArea className="h-[400px] lg:h-[calc(100%-150px)] p-4 sm:p-6"> {/* Adjust scroll area height */}
                <div className="space-y-4">
                 {messages.length === 0 ? (
                     <Alert variant="default" className="bg-secondary/50">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Sin Mensajes</AlertTitle>
                        <AlertDescription>
                            Aún no hay mensajes para esta donación.
                         </AlertDescription>
                    </Alert>
                 ) : (
                    messages.map((msg) => (
                        <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${
                            msg.sender === role ? 'justify-end' : ''
                        }`}
                        >
                        {msg.sender !== role && (
                             <Avatar className="h-8 w-8 border">
                                {getSenderAvatar(msg.sender)}
                            </Avatar>
                        )}

                        <div
                            className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                            msg.sender === role
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : msg.sender === 'system'
                                ? 'bg-muted text-muted-foreground border border-border rounded-lg w-full text-center italic text-xs py-1 px-2'
                                : 'bg-card text-card-foreground border border-border rounded-bl-none'
                            }`}
                        >
                            {msg.sender !== 'system' && (
                                <p className={`text-xs font-medium mb-1 ${ msg.sender === role ? 'text-primary-foreground/80' : 'text-muted-foreground' }`}>
                                     {getSenderName(msg.sender)}
                                 </p>
                             )}
                            <p className={`text-sm ${msg.sender === 'system' ? 'italic' : ''}`}>{msg.text}</p>
                             <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                          <p className={`text-xs mt-1 ${ msg.sender === role ? 'text-primary-foreground/70' : 'text-muted-foreground/80'} ${msg.sender === 'system' ? 'hidden' : 'block'}`}>
                                             {formatRelativeDate(msg.timestamp)}
                                         </p>
                                    </TooltipTrigger>
                                    <TooltipContent side={msg.sender === role ? 'left' : 'right'}>
                                        {formatDate(msg.timestamp)}
                                    </TooltipContent>
                                </Tooltip>
                             </TooltipProvider>
                        </div>

                         {msg.sender === role && (
                             <Avatar className="h-8 w-8 border">
                                {getSenderAvatar(msg.sender)}
                            </Avatar>
                        )}

                        </div>
                    ))
                 )}
                </div>
             </ScrollArea>
          </CardContent>
          {/* Only allow messaging if donation is claimed and not delivered/expired */}
          {donation.status === 'claimed' && (
              <>
                 <Separator />
                  <CardFooter className="p-3 sm:p-4 border-t">
                    <div className="flex w-full items-center gap-2">
                    <Textarea
                        placeholder="Escribe tu mensaje aquí..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow resize-none text-sm min-h-[40px] max-h-[100px]"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button onClick={handleSendMessage} size="icon" className="h-9 w-9 flex-shrink-0" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Enviar Mensaje</span>
                    </Button>
                    </div>
                </CardFooter>
              </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DonationDetailView;


"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, MessageSquare, User, Building, CheckCircle } from 'lucide-react';
import type { Donation, Message } from '@/types/donation'; // Import types

// Mock Data Function (similar to DonationList but focuses on messages)
const fetchMockMessageThreads = (role: 'business' | 'organization'): Donation[] => {
  // Reuse donation generation logic but ensure some have messages
  const mockData = Array.from({ length: 5 }, (_, i) => {
     const status = i % 2 === 0 ? 'claimed' : 'delivered'; // Alternate claimed/delivered
     const donationId = `msg-thread-${i + 1}`;
     const baseDate = new Date();
     const postedDate = new Date(baseDate.getTime() - 86400000 * (i + 3)); // Posted 3-7 days ago
     const claimedDate = new Date(postedDate.getTime() + 86400000); // Claimed 1 day after post
     const deliveredDate = status === 'delivered' ? new Date(claimedDate.getTime() + 86400000 * (i % 2 + 1)) : undefined; // Delivered 1-2 days after claim

     const messages: Message[] = [
       { id: `${donationId}-m1`, sender: 'system', text: 'Donación publicada.', timestamp: postedDate },
       { id: `${donationId}-m2`, sender: 'organization', text: `Reclamado ${i % 3 === 0 ? '¿Podemos recoger mañana?' : '¡Gracias!'}`, timestamp: claimedDate },
       { id: `${donationId}-m3`, sender: 'business', text: `Confirmado ${i % 3 === 0 ? 'Mañana ok.' : 'De nada.'}`, timestamp: new Date(claimedDate.getTime() + 3600000) },
     ];
      if (status === 'delivered' && i % 2 !== 0) {
        messages.push({ id: `${donationId}-m4`, sender: 'organization', text: 'Recogido sin problemas.', timestamp: deliveredDate! });
        messages.push({ id: `${donationId}-m5`, sender: 'system', text: 'Entrega Validada.', timestamp: new Date(deliveredDate!.getTime() + 1800000) });
      }
       if(role === 'organization' && i===1) messages.push({ id: `${donationId}-m6`, sender: 'business', text: '¿Alguna novedad sobre la recogida?', timestamp: new Date() });
       if(role === 'business' && i===0) messages.push({ id: `${donationId}-m7`, sender: 'organization', text: '¿Estáis hoy hasta las 5?', timestamp: new Date() });


     return {
       id: donationId,
       itemName: `Artículo de Prueba ${i + 1}`,
       quantity: `${i + 1} unidad(es)`,
       postedBy: `Empresa ${String.fromCharCode(65 + i)}`,
       claimedBy: `Org ${i + 1}`,
       status: status,
       messages: messages,
       // Add other required fields with mock values if necessary
       expirationDate: new Date(baseDate.getTime() + 86400000 * 5).toISOString(),
       pickupLocation: `Ubicación ${i+1}`,
       isFree: true,
       postedAt: postedDate.toISOString(),
       claimedAt: claimedDate.toISOString(),
       deliveredAt: deliveredDate?.toISOString(),
     };
   });

    // Filter based on role (simple example: show all threads for demo)
   // In a real app: filter based on d.claimedBy === currentUserOrgId or d.postedBy === currentUserBusinessId
   return mockData.filter(d => d.status === 'claimed' || d.status === 'delivered');
};


interface MockMessagesViewProps {
  role: 'business' | 'organization';
}

const MockMessagesView: FC<MockMessagesViewProps> = ({ role }) => {
  const [threads, setThreads] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setThreads(fetchMockMessageThreads(role));
      setIsLoading(false);
    }, 1000); // Simulate loading
  }, [role]);

   const formatRelativeDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (isNaN(dateObj.getTime())) return '';
        return formatDistanceToNowStrict(dateObj, { addSuffix: true, locale: es });
    } catch { return ''; }
   };

   const getLastMessage = (messages: Message[] | undefined): Message | null => {
        if (!messages || messages.length === 0) return null;
        // Sort by timestamp descending to get the latest
        return [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
   }

  return (
    <Card className="shadow-md border-border/40">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
             <Inbox className="h-5 w-5 text-primary"/> Bandeja de Entrada (Simulada)
        </CardTitle>
        <CardDescription>Conversaciones recientes sobre tus donaciones.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
           <div className="p-6 space-y-4">
                {Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg animate-pulse">
                        <div className="bg-muted rounded-full h-10 w-10"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                         <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                ))}
           </div>
        ) : threads.length === 0 ? (
          <div className="p-6">
             <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertTitle>Sin Conversaciones</AlertTitle>
                <AlertDescription>
                  No tienes mensajes activos en este momento.
                </AlertDescription>
             </Alert>
           </div>
        ) : (
          <ScrollArea className="h-[500px] p-2">
            <div className="space-y-2 p-4">
              {threads.map((thread) => {
                 const lastMessage = getLastMessage(thread.messages);
                 const otherParty = role === 'business' ? thread.claimedBy || 'Organización' : thread.postedBy;
                 const otherPartyRole = role === 'business' ? 'organization' : 'business';
                 const isUnread = lastMessage && lastMessage.sender !== role && lastMessage.sender !== 'system'; // Simple unread logic

                return (
                  <Link href={`/donations/${thread.id}`} key={thread.id} legacyBehavior>
                    <a className={`block p-3 rounded-lg border transition-colors duration-150 ${isUnread ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' : 'bg-card hover:bg-secondary/50 border-border/30'}`}>
                      <div className="flex items-center space-x-3">
                         <Avatar className="h-9 w-9 border">
                           <AvatarFallback>
                             {otherPartyRole === 'organization' ? <User className="h-4 w-4"/> : <Building className="h-4 w-4"/>}
                           </AvatarFallback>
                         </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-center">
                             <p className={`text-sm font-medium truncate ${isUnread ? 'text-primary font-semibold' : 'text-foreground'}`}>
                                {otherParty}
                             </p>
                              {thread.status === 'delivered' && <Badge variant="outline" className="text-xs px-1.5 py-0"><CheckCircle className="h-3 w-3 mr-1 text-green-600"/> Completado</Badge>}
                              {thread.status === 'claimed' && !thread.deliveredAt && <Badge variant="secondary" className="text-xs px-1.5 py-0">En Proceso</Badge>}
                          </div>
                           <p className="text-xs text-muted-foreground truncate mb-1">Sobre: {thread.itemName}</p>
                          {lastMessage && (
                            <p className={`text-xs truncate ${isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                               {lastMessage.sender === role ? 'Tú: ' : lastMessage.sender === 'system' ? '' : ''}
                               {lastMessage.text}
                            </p>
                          )}
                        </div>
                        {lastMessage && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 ml-2">
                                {formatRelativeDate(lastMessage.timestamp)}
                            </span>
                        )}
                      </div>
                    </a>
                  </Link>
                );
               })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MockMessagesView;

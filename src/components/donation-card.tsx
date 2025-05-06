import type { FC } from 'react';
import Image from 'next/image';
import { useState } from 'react'; // Import useState
import { format, parseISO, formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Package, Info, Recycle, CheckCircle, AlertTriangle, Clock, MessageSquare, Eye, HandCoins, BadgePercent, Minus, Plus, ShoppingCart } from 'lucide-react'; // Added icons
import Link from 'next/link';

import type { Donation } from '@/types/donation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from './ui/separator';
import { Input } from './ui/input'; // Import Input

interface DonationCardProps {
  donation: Donation;
  onClaim?: (donationId: string, quantityToClaim: number) => void; // Callback with quantity
  isClaimable?: boolean;
  showDetailsLink?: boolean;
}

const DonationCard: FC<DonationCardProps> = ({ donation, onClaim, isClaimable = false, showDetailsLink = false }) => {
  const [quantityToClaim, setQuantityToClaim] = useState(1); // State for quantity selection

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/D';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (isNaN(dateObj.getTime())) return 'Fecha Inválida';
      return format(dateObj, 'dd MMM, yyyy', { locale: es });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return 'Fecha inválida';
    }
  };

   const formatRelativeDate = (date: Date | string | undefined): string => {
    if (!date) return 'hace un tiempo';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
       if (isNaN(dateObj.getTime())) return 'Fecha Inválida';
      return formatDistanceToNowStrict(dateObj, { addSuffix: true, locale: es });
    } catch (error) {
      console.error("Error al formatear fecha relativa:", error);
      return 'Fecha inválida';
    }
   };

  const getStatusBadgeVariant = (status: Donation['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'available':
        return 'default';
      case 'claimed':
        return 'secondary';
      case 'delivered':
        return 'outline';
      case 'expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

   const getStatusIcon = (status: Donation['status']): React.ReactNode => {
     switch (status) {
      case 'available':
        return <Recycle className="mr-1 h-3 w-3" />;
      case 'claimed':
        return <Info className="mr-1 h-3 w-3" />;
      case 'delivered':
        return <CheckCircle className="mr-1 h-3 w-3" />;
      case 'expired':
        return <AlertTriangle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
   };

   const getStatusText = (status: Donation['status']): string => {
     switch (status) {
        case 'available': return 'Disponible';
        case 'claimed': return 'Reclamado';
        case 'delivered': return 'Entregado';
        case 'expired': return 'Caducado';
        default: return status;
     }
   };

   const PriceBadge: FC<{ isFree: boolean; pricePerUnit?: number; unit?: string }> = ({ isFree, pricePerUnit, unit }) => (
     <Badge variant={isFree ? "secondary" : "outline"} className={`text-xs ${isFree ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : 'border-orange-500 text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'}`}>
        {isFree ? (
             <>
                <BadgePercent className="mr-1 h-3 w-3" /> Gratis
             </>
        ) : (
            <>
                 <HandCoins className="mr-1 h-3 w-3" /> MXN$ {pricePerUnit?.toFixed(2)} / {unit || 'unidad'}
             </>
        )}
     </Badge>
   );

   const handleQuantityChange = (change: number) => {
    setQuantityToClaim(prev => {
        const newValue = prev + change;
        if (newValue < 1) return 1; // Minimum 1
        if (newValue > donation.quantity) return donation.quantity; // Maximum available
        return newValue;
    });
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       let value = parseInt(e.target.value, 10);
       if (isNaN(value) || value < 1) value = 1;
       if (value > donation.quantity) value = donation.quantity;
       setQuantityToClaim(value);
   };


  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card border border-border rounded-lg">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2 mb-1">
           <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-primary flex-shrink-0"/>
              <span className="line-clamp-2">{donation.itemName}</span>
           </CardTitle>
           <Badge variant={getStatusBadgeVariant(donation.status)} className="capitalize whitespace-nowrap flex-shrink-0 flex items-center text-xs px-2 py-0.5">
             {getStatusIcon(donation.status)}
             {getStatusText(donation.status)}
           </Badge>
        </div>
         <div className="flex justify-between items-center mt-1">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <p className="text-xs text-muted-foreground cursor-default">
                            Publicado por {donation.postedBy} {formatRelativeDate(donation.postedAt)}
                         </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{formatDate(donation.postedAt)}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
             <PriceBadge isFree={donation.isFree} pricePerUnit={donation.pricePerUnit} unit={donation.unit} />
         </div>

        {donation.description && (
          <CardDescription className="text-xs text-muted-foreground pt-1 line-clamp-2">{donation.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow grid gap-2 text-sm">
         {donation.photoUrl ? (
           <div className="relative h-40 w-full rounded-md overflow-hidden bg-muted mb-2">
             <Image
               src={donation.photoUrl}
               alt={`Foto de ${donation.itemName}`}
               fill={true}
               style={{ objectFit: 'contain', padding: '4px' }}
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               data-ai-hint={donation['data-ai-hint'] || 'food donation'}
               priority={false}
               className="rounded-md"
             />
           </div>
         ) : (
            <div className="flex items-center justify-center h-40 w-full rounded-md bg-secondary mb-2" data-ai-hint="food donation abstract">
                <Package className="h-16 w-16 text-muted-foreground opacity-30" />
            </div>
         )}
        <div className="grid grid-cols-[auto,1fr] items-center gap-x-2 gap-y-1">
           <TooltipProvider>
             <Tooltip>
                <TooltipTrigger>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                 <TooltipContent side="left">
                    <p>Fecha de Caducidad</p>
                 </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           <span className="truncate">Caduca: {formatDate(donation.expirationDate)} ({formatRelativeDate(donation.expirationDate)})</span>

           <TooltipProvider>
             <Tooltip>
                <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                 <TooltipContent side="left">
                    <p>Cantidad Disponible</p>
                 </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           {/* Updated Quantity Display */}
           <span className="truncate">Disponibles: {donation.quantity} {donation.unit}</span>

           <TooltipProvider>
             <Tooltip>
                <TooltipTrigger>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                 <TooltipContent side="left">
                    <p>Ubicación de Recogida</p>
                 </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           <span className="truncate">{donation.pickupLocation}</span>
        </div>

      </CardContent>
       <Separator className="my-0 mx-4"/>
      <CardFooter className="p-3 flex flex-col gap-2">
         {/* Claim Section (if applicable) */}
        {isClaimable && donation.status === 'available' && onClaim && (
          <div className="w-full space-y-2">
             <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(-1)} disabled={quantityToClaim <= 1}>
                     <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                     type="number"
                     className="h-7 w-16 text-center px-1"
                     value={quantityToClaim}
                     onChange={handleInputChange}
                     min={1}
                     max={donation.quantity}
                   />
                   <span className="text-xs text-muted-foreground ml-1">{donation.unit}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(1)} disabled={quantityToClaim >= donation.quantity}>
                     <Plus className="h-4 w-4" />
                  </Button>
             </div>
              <Button onClick={() => onClaim(donation.id, quantityToClaim)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8">
                 <ShoppingCart className="mr-1 h-3 w-3"/> Reclamar {quantityToClaim} {donation.unit}
              </Button>
          </div>
        )}

         {/* Details Link (if applicable) */}
         {showDetailsLink && donation.status === 'claimed' && (
           <Link href={`/donations/${donation.id}`} passHref legacyBehavior>
             <Button variant="outline" className="w-full text-xs h-8">
                <MessageSquare className="mr-1 h-3 w-3" /> Ver Detalles / Mensajes
             </Button>
           </Link>
        )}

         {/* Status Messages */}
         {donation.status === 'claimed' && !showDetailsLink && (
            <p className="text-xs text-center w-full text-muted-foreground italic">
              Reclamado por {donation.claimedBy || 'una organización'} {donation.claimedAt ? formatRelativeDate(donation.claimedAt) : ''}
            </p>
         )}
          {donation.status === 'delivered' && (
            <p className="text-xs text-center w-full text-green-700 dark:text-green-400 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3"/> Entregado Correctamente
            </p>
          )}
           {donation.status === 'expired' && (
            <p className="text-xs text-center w-full text-destructive flex items-center justify-center gap-1">
                <AlertTriangle className="h-3 w-3"/> Esta donación ha caducado.
            </p>
           )}

          {/* Fallback View Details Icon */}
         {donation.status !== 'available' && !showDetailsLink && (
             <div className="w-full flex justify-end"> {/* Align icon to the right */}
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={`/donations/${donation.id}`} passHref legacyBehavior>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ver Detalles</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
             </div>
         )}
      </CardFooter>
    </Card>
  );
};

export default DonationCard;

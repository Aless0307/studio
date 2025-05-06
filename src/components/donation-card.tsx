import type { FC } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, Package, Info, Recycle, CheckCircle, AlertTriangle } from 'lucide-react';

import type { Donation } from '@/types/donation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DonationCardProps {
  donation: Donation;
  onClaim: (donationId: string) => void; // Callback when 'Claim' button is clicked
  isClaimable?: boolean; // Determines if the claim button should be shown
}

const DonationCard: FC<DonationCardProps> = ({ donation, onClaim, isClaimable = true }) => {
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  const getStatusBadgeVariant = (status: Donation['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'available':
        return 'default'; // Use primary color (green in this theme)
      case 'claimed':
        return 'secondary';
      case 'delivered':
        return 'outline'; // Use a neutral/success outline
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
   }

  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
           <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary"/> {donation.itemName}
           </CardTitle>
           <Badge variant={getStatusBadgeVariant(donation.status)} className="capitalize whitespace-nowrap flex items-center">
             {getStatusIcon(donation.status)}
             {donation.status}
           </Badge>
        </div>
        {donation.description && (
          <CardDescription className="text-sm pt-1">{donation.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow grid gap-3 text-sm">
         {donation.photoUrl ? (
           <div className="relative h-40 w-full rounded-md overflow-hidden bg-muted">
             <Image
               src={donation.photoUrl}
               alt={donation.itemName}
               layout="fill"
               objectFit="cover"
               data-ai-hint="food donation"
             />
           </div>
         ) : (
            // Placeholder if no image
            <div className="flex items-center justify-center h-40 w-full rounded-md bg-secondary" data-ai-hint="food donation abstract">
                <Package className="h-16 w-16 text-muted-foreground opacity-50" />
            </div>
         )}
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span>Quantity: {donation.quantity}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Expires: {formatDate(donation.expirationDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Pickup: {donation.pickupLocation}</span>
        </div>
         <div className="text-xs text-muted-foreground pt-1">
            Posted on: {formatDate(donation.postedAt)} by {donation.postedBy}
        </div>
      </CardContent>
      <CardFooter>
        {isClaimable && donation.status === 'available' && (
          <Button onClick={() => onClaim(donation.id)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Claim Donation
          </Button>
        )}
         {donation.status === 'claimed' && (
            <p className="text-sm text-center w-full text-muted-foreground">Claimed by {donation.claimedBy || 'an organization'}</p>
         )}
          {donation.status === 'delivered' && (
            <p className="text-sm text-center w-full text-green-700 dark:text-green-400">Successfully Delivered</p>
          )}
           {donation.status === 'expired' && (
            <p className="text-sm text-center w-full text-destructive">This donation has expired.</p>
           )}
      </CardFooter>
    </Card>
  );
};

export default DonationCard;

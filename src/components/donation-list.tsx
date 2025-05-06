
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { Donation, Message } from '@/types/donation';
import DonationCard from './donation-card';
import { Skeleton } from './ui/skeleton';
import { Card as SkeletonCard, CardContent as SkeletonCardContent, CardFooter as SkeletonCardFooter, CardHeader as SkeletonCardHeader } from "@/components/ui/card"; // Use aliases for skeleton card
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';


// --- Mock Data (Translated & Expanded with new fields) ---
const generateMockMessages = (donationId: string, status: Donation['status']): Message[] => {
  const messages: Message[] = [];
  const baseTime = new Date();

  messages.push({
    id: `${donationId}-msg-1`,
    sender: 'system',
    text: 'Donación publicada por Empresa.',
    timestamp: new Date(baseTime.getTime() - 86400000 * 2), // 2 days ago
  });

  if (status === 'claimed' || status === 'delivered') {
    messages.push({
      id: `${donationId}-msg-2`,
      sender: 'organization',
      text: 'Hola, hemos reclamado esta donación. ¿Cuándo podemos pasar a recogerla?',
      timestamp: new Date(baseTime.getTime() - 86400000), // 1 day ago
    });
    messages.push({
      id: `${donationId}-msg-3`,
      sender: 'business',
      text: '¡Genial! Pueden pasar mañana entre las 10 AM y las 4 PM. Por favor, usen la entrada trasera.',
      timestamp: new Date(baseTime.getTime() - 86400000 + 3600000), // 1 day ago + 1 hour
    });
  }
  if (status === 'delivered') {
     messages.push({
      id: `${donationId}-msg-4`,
      sender: 'organization',
      text: 'Recogido, ¡muchas gracias!',
      timestamp: new Date(baseTime.getTime() - 3600000), // 1 hour ago
    });
     messages.push({
      id: `${donationId}-msg-5`,
      sender: 'system',
      text: 'Entrega validada por la empresa.',
      timestamp: new Date(baseTime.getTime() - 1800000), // 30 mins ago
    });
  }

  return messages;
};

const generateMockDonations = (count: number): Donation[] => {
  const items = ['Panes variados', 'Manzanas Frescas Fuji', 'Sopa de Lentejas Enlatada', 'Cartones de Leche Semidesnatada', 'Cajas de Pasta Integral', 'Vasos de Yogur Griego Natural', 'Croissants y Bollería', 'Plátanos Maduros'];
  const units = ['bolsas', 'kg', 'latas', 'litros', 'cajas', 'unidades', 'unidades', 'kg']; // Match units to items
  const quantities = [10, 5, 24, 20, 15, 50, 30, 8]; // Numeric quantities
  const locations = ['Panadería El Sol', 'Frutería La Huerta', 'Almacén Central FoodLink', 'Cafetería El Rincón', 'Mercado Municipal Puesto 5', 'Supermercado La Despensa', 'Panadería Delicias', 'Frutería Vitalidad'];
  const statuses: Donation['status'][] = ['available', 'available', 'claimed', 'available', 'delivered', 'expired', 'claimed', 'delivered'];
  const descriptions = [
    'Pan del día anterior, ideal para tostadas o migas.',
    'Manzanas Fuji orgánicas, algunas con pequeñas marcas.',
    'Sopa de lentejas casera, lista para calentar.',
    'Leche UHT semidesnatada, caducidad próxima (5 días).',
    'Penne integral de trigo duro.',
    'Yogur griego natural sin azúcar, bueno por 3 días más.',
    'Excedente de croissants y napolitanas del día.',
    'Caja de plátanos maduros, ideales para batidos o repostería.',
  ];
   const photoHints = ['assorted bread', 'fuji apples', 'lentil soup', 'milk cartons', 'pasta boxes', 'yogurt cups', 'pastries assortment', 'ripe bananas']; // Specific, relevant hints
   const pickupInstructions = [
     'Preguntar por Ana en recepción. L-V 9am-5pm.',
     'Recoger en muelle de carga trasero. Tocar timbre.',
     'Entrada por puerta lateral (indicada). Aparcamiento disponible.',
     'Avisar con 30 min de antelación. Llamar al 555-1234.',
     'Puesto 5, preguntar por Carlos. Horario de mercado.',
     'Ir a atención al cliente. Muelle de descarga disponible.',
     'Preguntar por Luis en obrador. L-S 8am-2pm.',
     'Recoger antes de las 12pm. Muelle trasero.',
   ];
   // Example prices in MXN$
   const prices = [undefined, 10.50, undefined, 5.00, undefined, 3.50, 8.00, 12.00];


  return Array.from({ length: count }, (_, i) => {
    const index = i % items.length; // Use modulo for cycling through data
    const status = statuses[index];
    const baseDate = new Date();
    const expirationOffset = status === 'expired' ? -2 : (index % 7) + 1;
    const expirationDate = new Date(baseDate.getTime() + 86400000 * expirationOffset);

    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - (index % 5));

    let claimedDate: Date | undefined = undefined;
    let deliveredDate: Date | undefined = undefined;

    if (status === 'claimed' || status === 'delivered') {
        claimedDate = new Date(postedDate.getTime() + 86400000 * (index % 2 + 1));
        if (claimedDate > new Date()) claimedDate = new Date(postedDate.getTime() + 3600000);

        if (status === 'delivered') {
            deliveredDate = new Date(claimedDate.getTime() + 86400000 * (index % 3 + 1));
            if (deliveredDate > new Date()) deliveredDate = new Date(claimedDate.getTime() + 7200000);
        }
    }


    const donationId = `donation-${i + 1}`;
    const donationStatus = status;
    const isFree = prices[index] === undefined; // Determine if free based on price presence

    return {
      id: donationId,
      itemName: items[index],
      description: descriptions[index],
      quantity: quantities[index], // Use numeric quantity
      unit: units[index], // Use specific unit
      pricePerUnit: prices[index], // Assign price in MXN$
      expirationDate: expirationDate.toISOString(),
      pickupLocation: locations[index],
      pickupInstructions: pickupInstructions[index],
      photoUrl: `https://picsum.photos/seed/${photoHints[index].replace(/ /g, '_')}/400/300`, // Use specific hint for image
      postedBy: `Empresa ${String.fromCharCode(65 + (index % 5))}`,
      status: donationStatus,
      claimedBy: status === 'claimed' || status === 'delivered' ? `Org ${index % 3 + 1}` : undefined,
      postedAt: postedDate.toISOString(),
      claimedAt: claimedDate?.toISOString(),
      deliveredAt: deliveredDate?.toISOString(),
      isFree: isFree, // Set isFree based on price
      messages: generateMockMessages(donationId, donationStatus),
      'data-ai-hint': photoHints[index], // Use specific hint
      validationCode: status === 'delivered' || status === 'claimed' ? `VAL${100 + i}`: undefined,
      qualityRating: status === 'delivered' ? (index % 5) + 1 : undefined
    };
  });
};
// --- End Mock Data ---


interface DonationListProps {
   listType?: 'available' | 'claimed' | 'history' | 'all';
   role: 'business' | 'organization';
   className?: string;
}

const DonationList: FC<DonationListProps> = ({ listType = 'available', role, className }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    console.log(`Buscando donaciones por tipo: ${listType}, rol: ${role}`);
    setTimeout(() => {
      const mockData = generateMockDonations(12);

      let filteredData = mockData;
      // --- Filtering Logic (Keep as is, assuming filtering works with new data structure) ---
       if (role === 'organization') {
          if (listType === 'available') {
              filteredData = mockData.filter(d => d.status === 'available');
          } else if (listType === 'claimed') {
              // Org's claimed but not yet delivered/validated
              filteredData = mockData.filter(d => d.status === 'claimed' /* && d.claimedBy === currentUserOrgId */);
          } else if (listType === 'history') {
              // Org's completed (delivered/rated) or expired claims
              filteredData = mockData.filter(d => (d.status === 'delivered' || d.status === 'expired') /* && d.claimedBy === currentUserOrgId */);
          }
          // 'all' for org might mean available + their claimed/history (not implemented here)
      } else if (role === 'business') {
           if (listType === 'available') { // Businesses might see available to monitor market? Or filter their own available.
              filteredData = mockData.filter(d => d.status === 'available' /* && d.postedBy === currentUserBusinessId */);
          } else if (listType === 'claimed') {
              // Business's items claimed by others, pending validation
              filteredData = mockData.filter(d => d.status === 'claimed' /* && d.postedBy === currentUserBusinessId */);
          } else if (listType === 'history') {
              // Business's completed (delivered) or expired posts
              filteredData = mockData.filter(d => (d.status === 'delivered' || d.status === 'expired') /* && d.postedBy === currentUserBusinessId */);
          } else if (listType === 'all') {
             // All donations posted by this business
             filteredData = mockData; //.filter(d => d.postedBy === currentUserBusinessId);
          }
      }
      // --- End Filtering Logic ---


      setDonations(filteredData);
      setIsLoading(false);
    }, 1500);
  }, [listType, role]);

   const handleClaim = (donationId: string, quantityToClaim: number) => {
    console.log(`Reclamando ${quantityToClaim} unidades de la donación ${donationId}`);

    setDonations(prevDonations => {
       const updatedDonations = prevDonations.map(d => {
        if (d.id === donationId) {
            const remainingQuantity = d.quantity - quantityToClaim;
            // If remaining quantity is 0 or less, mark as claimed fully
            // Otherwise, just update the quantity (this simple model assumes partial claims remove the listing for simplicity, adjust if needed)
            return {
                ...d,
                // quantity: remainingQuantity > 0 ? remainingQuantity : 0, // Example: Update quantity
                status: 'claimed' as const, // Mark as claimed regardless of partial/full for now
                claimedBy: 'Tu Organización', // Assume current user
                claimedAt: new Date().toISOString() // Set claim time
            };
        }
        return d;
       });

        // If listType is 'available', filter out the claimed item immediately
       if (listType === 'available') {
            return updatedDonations.filter(d => d.id !== donationId);
       }
       return updatedDonations;

    });
     toast({
      title: "¡Donación Reclamada!",
      description: `Has reclamado ${quantityToClaim} unidades de ${donations.find(d => d.id === donationId)?.itemName || 'la donación'}. Revisa la pestaña 'Mis Reclamadas' para ver detalles y mensajes.`,
    });
  };

  const loadingSkeletons = Array.from({ length: 6 }).map((_, index) => (
       <SkeletonCard key={index} className="w-full overflow-hidden shadow-md flex flex-col">
         <SkeletonCardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
         </SkeletonCardHeader>
          <SkeletonCardContent className="flex-grow grid gap-3">
             <Skeleton className="h-40 w-full rounded-md" />
             <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-3/4" />
             <Skeleton className="h-4 w-4/5" />
             <Skeleton className="h-3 w-1/3 mt-1" />
          </SkeletonCardContent>
           <SkeletonCardFooter>
             <Skeleton className="h-10 w-full" />
           </SkeletonCardFooter>
       </SkeletonCard>
    ));


  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", className)}>
        {loadingSkeletons}
      </div>
    );
  }

  if (donations.length === 0) {
     return (
        <div className="flex justify-center items-center min-h-[40vh] p-4 md:p-6">
             <Alert className="max-w-md text-center bg-card border-border shadow-sm">
                <Info className="h-5 w-5 stroke-primary" />
                <AlertTitle className="font-semibold text-lg">No Hay Donaciones Aquí</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                    {listType === 'available' && "¡Parece que todas las donaciones han sido reclamadas! Vuelve más tarde."}
                    {listType === 'claimed' && "No tienes donaciones reclamadas pendientes."}
                    {listType === 'history' && "No hay historial de donaciones todavía."}
                    {listType === 'all' && "No se encontraron donaciones."}
                 </AlertDescription>
            </Alert>
        </div>
     )
  }

  return (
     <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", className)}>
      {donations.map(donation => (
        <DonationCard
          key={donation.id}
          donation={donation}
          onClaim={handleClaim} // Pass the updated handler
          isClaimable={role === 'organization' && donation.status === 'available'}
          showDetailsLink={role === 'organization' && donation.status === 'claimed'}
        />
      ))}
    </div>
  );
};

export default DonationList;

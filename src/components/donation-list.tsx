
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react'; // Import useEffect
import type { Donation, Message } from '@/types/donation'; // Import Message type
import DonationCard from './donation-card';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"; // Import Card components
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility


// --- Mock Data (Translated & Expanded) ---
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
  const items = ['Panes variados', 'Manzanas Frescas Fuji', 'Sopa de Lentejas Enlatada', 'Cartones de Leche Semidesnatada', 'Cajas de Pasta Integral', 'Vasos de Yogur Griego Natural'];
  const quantities = ['10 bolsas', '5 kg', '24 latas (1 caja)', '20 cartones', '15 cajas', '50 vasos'];
  const locations = ['Panadería El Sol', 'Frutería La Huerta', 'Almacén Central FoodLink', 'Cafetería El Rincón', 'Mercado Municipal Puesto 5', 'Supermercado La Despensa'];
  const statuses: Donation['status'][] = ['available', 'available', 'claimed', 'claimed', 'delivered', 'expired', 'available', 'delivered'];
  const descriptions = [
    'Pan del día anterior, ideal para tostadas o migas.',
    'Manzanas Fuji orgánicas, algunas con pequeñas marcas.',
    'Sopa de lentejas casera, lista para calentar.',
    'Leche UHT semidesnatada, caducidad próxima (5 días).',
    'Penne integral de trigo duro.',
    'Yogur griego natural sin azúcar, bueno por 3 días más.',
    'Excedente de croissants y bollería del día.',
    'Caja de plátanos maduros, ideales para batidos o repostería.',
  ];
   const photoHints = ['bread bakery assortment', 'apples fruit crate', 'lentil soup cans', 'milk cartons shelf', 'pasta box variety', 'yogurt cups plain', 'croissants pastry', 'bananas ripe box']; // AI Hints for picsum
   const pickupInstructions = [
     'Preguntar por Ana en recepción. L-V 9am-5pm.',
     'Recoger en muelle de carga trasero. Tocar timbre.',
     'Entrada por puerta lateral (indicada). Aparcamiento disponible.',
     'Avisar con 30 min de antelación. Llamar al 555-1234.',
     'Puesto 5, preguntar por Carlos. Horario de mercado.',
     'Ir a atención al cliente. Muelle de descarga disponible.',
     'Preguntar por Luis en obrador. L-S 8am-2pm.',
     'Recoger antes de las 12pm. Muelle trasero.',
   ]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length];
    const baseDate = new Date();
    const expirationOffset = status === 'expired' ? -2 : (i % 7) + 1; // Expired 2 days ago or expires in 1-7 days
    baseDate.setDate(baseDate.getDate() + expirationOffset);

    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - (i % 5)); // Posted recently

    let claimedDate: Date | undefined = undefined;
    let deliveredDate: Date | undefined = undefined;

    if (status === 'claimed' || status === 'delivered') {
        claimedDate = new Date(postedDate.getTime() + 86400000 * (i % 2 + 1)); // Claimed 1-2 days after post
        if (claimedDate > new Date()) claimedDate = new Date(postedDate.getTime() + 3600000) // Ensure claimed date is not in future if status is claimed/delivered

        if (status === 'delivered') {
            deliveredDate = new Date(claimedDate.getTime() + 86400000 * (i % 3 + 1)); // Delivered 1-3 days after claim
            if (deliveredDate > new Date()) deliveredDate = new Date(claimedDate.getTime() + 7200000); // Ensure delivered date is not in future
        }
    }


    const donationId = `donation-${i + 1}`;
    const donationStatus = status; // Use the generated status

    return {
      id: donationId,
      itemName: items[i % items.length],
      description: descriptions[i % descriptions.length],
      quantity: quantities[i % quantities.length],
      expirationDate: baseDate.toISOString(),
      pickupLocation: locations[i % locations.length],
      pickupInstructions: pickupInstructions[i % pickupInstructions.length], // Add instructions
      photoUrl: `https://picsum.photos/seed/${i + 100}/400/300`, // Use seeded picsum for consistency
      postedBy: `Empresa ${String.fromCharCode(65 + (i % 5))}`, // Empresa A, B, C...
      status: donationStatus,
      claimedBy: status === 'claimed' || status === 'delivered' ? `Org ${i % 3 + 1}` : undefined,
      postedAt: postedDate.toISOString(),
      claimedAt: claimedDate?.toISOString(),
      deliveredAt: deliveredDate?.toISOString(),
      isFree: i % 4 !== 0, // Roughly 75% are free, 25% might have a symbolic price (indicated in card, not implemented as price yet)
      messages: generateMockMessages(donationId, donationStatus), // Add mock messages
      'data-ai-hint': photoHints[i % photoHints.length], // Use relevant hint
       validationCode: status === 'delivered' || status === 'claimed' ? `VAL${100 + i}`: undefined, // Add validation code for claimed/delivered
       qualityRating: status === 'delivered' ? (i % 5) + 1 : undefined // Add rating if delivered
    };
  });
};
// --- End Mock Data ---


interface DonationListProps {
   listType?: 'available' | 'claimed' | 'history' | 'all'; // Added 'all'
   role: 'business' | 'organization'; // To control actions like claiming
   className?: string; // Allow passing custom classes
}

const DonationList: FC<DonationListProps> = ({ listType = 'available', role, className }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate fetching data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, fetch from an API based on listType and role
    console.log(`Buscando donaciones por tipo: ${listType}, rol: ${role}`);
    setTimeout(() => {
      const mockData = generateMockDonations(12); // Generate more mock donations

      // Filter based on type and role (more specific examples)
      let filteredData = mockData;
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


      setDonations(filteredData);
      setIsLoading(false);
    }, 1500); // Simulate network delay
  }, [listType, role]); // Refetch if listType or role changes

  const handleClaim = (donationId: string) => {
    console.log(`Reclamando donación ${donationId}`);
    // Simulate API call to claim
    // Update the local state optimistically or after API confirmation
    setDonations(prevDonations => {
       const updatedDonations = prevDonations.map(d =>
        d.id === donationId ? { ...d, status: 'claimed' as const, claimedBy: 'Tu Organización' } : d
       );
        // If listType is 'available', filter out the claimed item immediately
       if (listType === 'available') {
            return updatedDonations.filter(d => d.id !== donationId);
       }
       return updatedDonations;

    });
     toast({
      title: "¡Donación Reclamada!",
      description: `Has reclamado exitosamente la donación ID: ${donationId}. Revisa la pestaña 'Mis Reclamadas' para ver detalles y mensajes.`,
    });
    // In a real app, you'd likely refetch or get updated data from the backend
  };

  const loadingSkeletons = Array.from({ length: 6 }).map((_, index) => (
       <Card key={index} className="w-full overflow-hidden shadow-md flex flex-col">
         <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
         </CardHeader>
          <CardContent className="flex-grow grid gap-3">
             <Skeleton className="h-40 w-full rounded-md" />
             <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-3/4" />
             <Skeleton className="h-4 w-4/5" />
             <Skeleton className="h-3 w-1/3 mt-1" />
          </CardContent>
           <CardFooter>
             <Skeleton className="h-10 w-full" />
           </CardFooter>
       </Card>
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
          donation={donation} // Pass full donation object
          onClaim={handleClaim}
          isClaimable={role === 'organization' && donation.status === 'available'} // Only orgs can claim available items
          showDetailsLink={role === 'organization' && donation.status === 'claimed'} // Show details link for claimed items for orgs
        />
      ))}
    </div>
  );
};

export default DonationList;


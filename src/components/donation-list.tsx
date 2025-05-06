"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { Donation, Message } from '@/types/donation';
import DonationCard from './donation-card';
import { Skeleton } from './ui/skeleton';
import { Card as SkeletonCard, CardContent as SkeletonCardContent, CardHeader as SkeletonCardHeader, CardFooter as SkeletonCardFooter } from "@/components/ui/card"; // Corregido para incluir CardFooter
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

// Función para asignar imágenes locales según el nombre del producto
const getLocalImageForItem = (itemName: string, status: Donation['status']): string => {
  const itemNameLower = itemName.toLowerCase();
  
  // Para donaciones reclamadas, usar sus imágenes específicas
  if (status === 'claimed') {
    if (itemNameLower.includes('pan')) {
      return '/images/pandulce.png';
    } else if (itemNameLower.includes('lentejas')) {
      return '/images/lentejas.jpg';
    } else if (itemNameLower.includes('yogur') || itemNameLower.includes('yogurt')) {
      return '/images/yogurtgriego.png';
    }
  } 
  // Para donaciones completadas (entregadas), usar imágenes específicas
  else if (status === 'delivered') {
    if (itemNameLower.includes('pan')) {
      return '/images/pandulce.png';
    } else if (itemNameLower.includes('arroz') && itemNameLower.includes('blanco')) {
      return '/images/arrocito.jpg';
    } else if (itemNameLower.includes('arroz')) {
      return '/images/arroz.avif';
    } else if (itemNameLower.includes('lentejas')) {
      return '/images/lentejas.jpg';
    } else if (itemNameLower.includes('yogur') || itemNameLower.includes('yogurt')) {
      return '/images/yogurtgriego.png';
    }
  }
  // Para donaciones expiradas
  else if (status === 'expired') {
    if (itemNameLower.includes('café') || itemNameLower.includes('cafe')) {
      return '/images/cafe.jpeg';
    } else if (itemNameLower.includes('donas')) {
      return '/images/donas.jpg';
    } else if (itemNameLower.includes('gelatina')) {
      return '/images/gelatina.jpg';
    }
  }
  // Para donaciones disponibles
  else {
    if (itemNameLower.includes('pan') || itemNameLower.includes('croissant') || itemNameLower.includes('bollería')) {
      return '/images/pan.jpg';
    } else if (itemNameLower.includes('manzanas')) {
      return '/images/manzanukis.jpg';
    } else if (itemNameLower.includes('leche')) {
      return '/images/leche.png';
    } else if (itemNameLower.includes('gelatina')) {
      return '/images/gelatina.jpg';
    } else if (itemNameLower.includes('donas')) {
      return '/images/donas.jpg';
    } else if (itemNameLower.includes('café') || itemNameLower.includes('cafe')) {
      return '/images/cafe.jpeg';
    } else if (itemNameLower.includes('pasta')) {
      return '/images/pastaintegral.jpg';
    } else if (itemNameLower.includes('plátanos')) {
      return '/images/platanosmaduros.jpg';
    } else if (itemNameLower.includes('yogur')) {
      return '/images/yogurtgriego.png';
    }
  }
  
  // Si no hay coincidencia específica, devolver una imagen predeterminada según el estado
  if (status === 'claimed' || status === 'delivered') {
    return '/images/pandulce.png';
  } else if (status === 'expired') {
    return '/images/cafe.jpeg';
  } else {
    return '/images/pan.jpg';
  }
};

const generateMockDonations = (count: number): Donation[] => {
  const items = [
    'Panes variados', 
    'Manzanas Fuji Frescas', 
    'Lentejas Ecológicas', // Cambiado de "Plátanos Maduros Orgánicos" a "Lentejas Ecológicas"
    'Cartones de Leche Semidesnatada', 
    'Arroz Integral Ecológico',
    'Vasos de Gelatina Surtida',
    'Pan Dulce Tradicional',
    'Yogurt Griego Natural'
  ];
  const units = ['bolsas', 'kg', 'kg', 'litros', 'kg', 'unidades', 'piezas', 'unidades'];
  const quantities = [10, 5, 8, 20, 15, 50, 30, 12];
  const locations = ['Panadería El Sol', 'Frutería La Huerta', 'Mercado Orgánico', 'Cafetería El Rincón', 'Mercado Municipal Puesto 5', 'Supermercado La Despensa', 'Panadería Delicias', 'Tienda Natural'];
  const statuses: Donation['status'][] = ['available', 'available', 'claimed', 'available', 'delivered', 'expired', 'claimed', 'claimed']; // 3 reclamadas
  const descriptions = [
    'Pan del día anterior, ideal para tostadas o migas.',
    'Manzanas Fuji orgánicas, algunas con pequeñas marcas.',
    'Lentejas ecológicas de primera calidad, sin conservantes.', // Nueva descripción para lentejas
    'Leche UHT semidesnatada, caducidad próxima (5 días).',
    'Arroz integral de cultivo ecológico, en perfectas condiciones.',
    'Gelatina de varios sabores, elaboración reciente.',
    'Pan dulce tradicional: conchas, orejas y bigotes recién horneados.',
    'Yogurt griego natural sin azúcares añadidos, alto en proteínas.'
  ];
  const photoHints = ['assorted bread', 'fuji apples', 'lentil soup', 'milk cartons', 'rice bags', 'jello cups', 'donuts assortment', 'coffee beans']; // Updated hints
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
    // En lugar de usar módulo para el índice, asignamos valores específicos
    // para cada donación en las posiciones 0-11
    let itemName = '';
    let description = '';
    let status: Donation['status'] = 'available';
    let unit = 'unidades';
    let quantity = 10;
    
    // Definimos 5 donaciones disponibles con sus descripciones específicas
    if (i === 0) {
      status = 'available';
      itemName = 'Manzanas Fuji Frescas';
      description = 'Manzanas Fuji orgánicas, algunas con pequeñas marcas.';
      unit = 'kg';
      quantity = 5;
    }
    else if (i === 1) {
      status = 'available';
      itemName = 'Cartones de Leche Semidesnatada';
      description = 'Leche UHT semidesnatada, caducidad próxima (5 días).';
      unit = 'litros';
      quantity = 20;
    }
    else if (i === 2) {
      status = 'available';
      itemName = 'Vasos de Gelatina Surtida';
      description = 'Gelatina de varios sabores, elaboración reciente.';
      unit = 'unidades';
      quantity = 50;
    }
    else if (i === 3) {
      status = 'available';
      itemName = 'Donas Glaseadas Variadas';
      description = 'Donas con diversos toppings y rellenos, recién horneadas.';
      unit = 'unidades';
      quantity = 24;
    }
    else if (i === 4) {
      status = 'available';
      itemName = 'Café Premium Colombiano';
      description = 'Café de origen colombiano, perfecto para baristas.';
      unit = 'kg';
      quantity = 3;
    }
    // 3 donaciones reclamadas: pan dulce, lentejas y yogurt
    else if (i === 5) {
      status = 'claimed';
      itemName = 'Pan Dulce Tradicional';
      description = 'Pan dulce tradicional: conchas, orejas y bigotes recién horneados.';
      unit = 'piezas';
      quantity = 30;
    }
    else if (i === 6) {
      status = 'claimed';
      itemName = 'Lentejas Ecológicas';
      description = 'Lentejas ecológicas de primera calidad, sin conservantes.';
      unit = 'kg';
      quantity = 8;
    }
    else if (i === 7) {
      status = 'claimed';
      itemName = 'Yogurt Griego Natural';
      description = 'Yogurt griego natural sin azúcares añadidos, alto en proteínas.';
      unit = 'unidades';
      quantity = 12;
    }
    // 3 donaciones entregadas (historial): pan, arroz integral y arroz blanco
    else if (i === 8) {
      status = 'delivered';
      itemName = 'Panes variados';
      description = 'Pan del día anterior, ideal para tostadas o migas.';
      unit = 'bolsas';
      quantity = 10;
    }
    else if (i === 9) {
      status = 'delivered';
      itemName = 'Arroz Integral Ecológico';
      description = 'Arroz integral de cultivo ecológico, en perfectas condiciones.';
      unit = 'kg';
      quantity = 15;
    }
    else if (i === 10) {
      status = 'delivered';
      itemName = 'Arroz Blanco Premium';
      description = 'Arroz blanco de grano largo, variedad jasmine importado.';
      unit = 'kg';
      quantity = 8;
    }
    // 1 donación expirada
    else {
      status = 'expired';
      itemName = 'Vasos de Gelatina Surtida';
      description = 'Gelatina de varios sabores, elaboración reciente.';
      unit = 'unidades';
      quantity = 15;
    }
    
    const baseDate = new Date();
    const expirationOffset = status === 'expired' ? -2 : 5; // 5 días para caducidad
    const expirationDate = new Date(baseDate.getTime() + 86400000 * expirationOffset);

    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - (i % 5));

    let claimedDate: Date | undefined = undefined;
    let deliveredDate: Date | undefined = undefined;

    if (status === 'claimed' || status === 'delivered') {
        claimedDate = new Date(postedDate.getTime() + 86400000);
        
        if (status === 'delivered') {
            deliveredDate = new Date(claimedDate.getTime() + 86400000 * 2);
        }
    }

    const donationId = `donation-${i + 1}`;
    const isFree = i % 2 === 0; // Alternar entre gratis y no gratis
    const pricePerUnit = isFree ? undefined : (5 + i % 10); // Precio aleatorio si no es gratis
    
    // Usar la función para asignar imágenes basado en el nombre del producto y su estado
    const photoUrl = getLocalImageForItem(itemName, status);

    return {
      id: donationId,
      itemName: itemName,
      description: description,
      quantity: quantity,
      unit: unit,
      pricePerUnit: pricePerUnit,
      expirationDate: expirationDate.toISOString(),
      pickupLocation: locations[i % locations.length],
      pickupInstructions: pickupInstructions[i % pickupInstructions.length],
      photoUrl: photoUrl,
      postedBy: `Empresa ${String.fromCharCode(65 + (i % 5))}`,
      status: status,
      claimedBy: status === 'claimed' || status === 'delivered' ? `Org ${i % 3 + 1}` : undefined,
      postedAt: postedDate.toISOString(),
      claimedAt: claimedDate?.toISOString(),
      deliveredAt: deliveredDate?.toISOString(),
      isFree: isFree,
      messages: generateMockMessages(donationId, status),
      'data-ai-hint': itemName.toLowerCase().replace(/ /g, '_'),
      validationCode: status === 'delivered' || status === 'claimed' ? `VAL${100 + i}`: undefined,
      qualityRating: status === 'delivered' ? (i % 5) + 1 : undefined
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
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      try {
          const mockData = generateMockDonations(12); // Generate mock data

          let filteredData = mockData;
          // --- Filtering Logic ---
           if (role === 'organization') {
              if (listType === 'available') {
                  filteredData = mockData.filter(d => d.status === 'available');
              } else if (listType === 'claimed') {
                  // Org's claimed but not yet delivered/validated (Assume 'Tu Organización' claims some)
                  // For mock, let's show all claimed by any Org
                  filteredData = mockData.filter(d => d.status === 'claimed' /* && d.claimedBy === 'Tu Organización' */);
              } else if (listType === 'history') {
                  // Org's completed (delivered/rated) or expired claims
                   filteredData = mockData.filter(d => (d.status === 'delivered' || d.status === 'expired') /* && d.claimedBy === 'Tu Organización' */);
              }
              // 'all' for org might mean available + their claimed/history (not implemented here)
          } else if (role === 'business') {
               if (listType === 'available') { // Businesses might see available to monitor market? Or filter their own available.
                  // Show only items posted by a hypothetical "current user business" - let's assume Empresa A
                  filteredData = mockData.filter(d => d.status === 'available' /* && d.postedBy === 'Empresa A' */);
              } else if (listType === 'claimed') {
                  // Business's items claimed by others, pending validation
                  filteredData = mockData.filter(d => d.status === 'claimed' /* && d.postedBy === 'Empresa A' */);
              } else if (listType === 'history') {
                  // Business's completed (delivered) or expired posts
                  filteredData = mockData.filter(d => (d.status === 'delivered' || d.status === 'expired') /* && d.postedBy === 'Empresa A' */);
              } else if (listType === 'all') {
                 // All donations posted by this business
                 filteredData = mockData; //.filter(d => d.postedBy === 'Empresa A');
              }
          }
          // --- End Filtering Logic ---

          setDonations(filteredData);
      } catch (error) {
         console.error("Error generating or filtering mock data:", error);
         setDonations([]); // Set empty on error
      } finally {
        setIsLoading(false);
      }
    }, 1500); // Simulate 1.5 second load

    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timer);

  }, [listType, role]);

   const handleClaim = (donationId: string, quantityToClaim: number) => {
    console.log(`Reclamando ${quantityToClaim} unidades de la donación ${donationId}`);

    // Find the donation being claimed
    const claimedDonation = donations.find(d => d.id === donationId);
    if (!claimedDonation) {
        toast({ title: "Error", description: "Donación no encontrada.", variant: "destructive" });
        return;
    }

    // Simulate state update
    setDonations(prevDonations => {
       const updatedDonations = prevDonations.map(d => {
        if (d.id === donationId) {
            // Simple model: assume full claim removes item from 'available' list.
            // In a real app, you might adjust quantity or handle partial claims differently.
            return {
                ...d,
                status: 'claimed' as const, // Mark as claimed
                claimedBy: 'Tu Organización', // Assume current user is 'Tu Organización'
                claimedAt: new Date().toISOString() // Set claim time
            };
        }
        return d;
       });

        // If the current view is 'available', filter out the newly claimed item
       if (listType === 'available') {
            return updatedDonations.filter(d => d.id !== donationId);
       }
       // Otherwise, just update the status within the existing list (e.g., in 'all' view)
       return updatedDonations;

    });

    // Show success toast
     toast({
      title: "¡Donación Reclamada!",
      description: `Has reclamado ${quantityToClaim} ${claimedDonation.unit} de ${claimedDonation.itemName}. Revisa la pestaña 'Mis Reclamadas' para ver detalles y mensajes.`,
      duration: 5000, // Show for 5 seconds
    });
  };

 // Skeleton Loader structure
 const loadingSkeletons = Array.from({ length: 6 }).map((_, index) => (
    <SkeletonCard key={index} className="w-full overflow-hidden shadow-md flex flex-col bg-card">
        <SkeletonCardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start mb-1">
                <Skeleton className="h-5 w-3/5" /> {/* Item Name */}
                <Skeleton className="h-4 w-1/4" /> {/* Badge */}
            </div>
            <div className="flex justify-between items-center mt-1">
                <Skeleton className="h-3 w-2/5" /> {/* Posted by */}
                <Skeleton className="h-4 w-1/3" /> {/* Price */}
            </div>
             <Skeleton className="h-3 w-4/5 mt-1" /> {/* Description */}
        </SkeletonCardHeader>
        <SkeletonCardContent className="p-4 pt-2 flex-grow grid gap-2">
            <Skeleton className="h-40 w-full rounded-md bg-muted mb-2" /> {/* Image */}
            <div className="grid grid-cols-[auto,1fr] items-center gap-x-2 gap-y-1">
                <Skeleton className="h-4 w-4 rounded-full" /> <Skeleton className="h-4 w-3/4" /> {/* Expiry */}
                <Skeleton className="h-4 w-4 rounded-full" /> <Skeleton className="h-4 w-2/3" /> {/* Quantity */}
                <Skeleton className="h-4 w-4 rounded-full" /> <Skeleton className="h-4 w-full" /> {/* Location */}
            </div>
        </SkeletonCardContent>
        <SkeletonCardFooter className="p-3">
             <Skeleton className="h-8 w-full" /> {/* Action Button / Status */}
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
                    {listType === 'claimed' && role === 'organization' && "No tienes donaciones reclamadas pendientes."}
                     {listType === 'claimed' && role === 'business' && "Ninguna de tus donaciones publicadas ha sido reclamada aún."}
                    {listType === 'history' && "No hay historial de donaciones todavía."}
                    {listType === 'all' && "No se encontraron donaciones."}
                 </AlertDescription>
            </Alert>
        </div>
     )
  }

  return (
     <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", className)}>
      {donations.map(donation => (
        <DonationCard
          key={donation.id}
          donation={donation}
          onClaim={handleClaim} // Pass the updated handler
          isClaimable={role === 'organization' && donation.status === 'available'}
          // Show details link for Org on their claimed items, or for Biz on items they posted that are claimed/delivered/expired
           showDetailsLink={
               (role === 'organization' && donation.status === 'claimed') ||
               (role === 'business' && (donation.status === 'claimed' || donation.status === 'delivered' || donation.status === 'expired'))
            }
        />
      ))}
    </div>
  );
};

export default DonationList;


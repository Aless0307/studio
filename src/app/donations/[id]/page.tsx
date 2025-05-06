
// src/app/donations/[id]/page.tsx
import type { FC } from 'react';
import Header from '@/components/header';
import DonationDetailView from '@/components/donation-detail-view';
import type { Donation, Message } from '@/types/donation'; // Assuming Donation type exists
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { parseISO } from 'date-fns';

// --- Mock Data Fetching (Updated) ---

// Helper to generate mock messages (consistent with MockMessagesView)
const generateMockMessagesForDetail = (donationId: string, status: Donation['status']): Message[] => {
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
    // Add specific messages from MockMessagesView example if needed
    if (donationId === 'msg-thread-2') { // Corresponds to i=1 in MockMessagesView
         messages.push({ id: `${donationId}-m6`, sender: 'business', text: '¿Alguna novedad sobre la recogida?', timestamp: new Date() });
    }
     if (donationId === 'msg-thread-1') { // Corresponds to i=0 in MockMessagesView
         messages.push({ id: `${donationId}-m7`, sender: 'organization', text: '¿Estáis hoy hasta las 5?', timestamp: new Date() });
     }


  return messages;
};


const fetchMockDonationById = (id: string): Donation | null => {
   // Simple mock: return the validation mock if ID matches
    if (id === 'donation-val-1') {
      return {
          id: `donation-val-1`,
          itemName: 'Sopa de Lentejas Enlatada',
          description: 'Sopa casera, lista para calentar.',
          quantity: 24, // Numeric quantity
          unit: 'latas', // Unit
          expirationDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
          pickupLocation: 'Almacén Central FoodLink',
          pickupInstructions: 'Entrada por puerta lateral (indicada). Aparcamiento disponible. L-V 9am-5pm.',
          photoUrl: `https://picsum.photos/seed/lentil_soup/400/300`, // Specific hint
          postedBy: `Empresa C`,
          status: 'claimed' as const,
          claimedBy: `Tu Organización`,
          postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          claimedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
          deliveredAt: undefined,
          validationCode: 'VAL101',
          qualityRating: undefined,
          isFree: true, // Explicitly free
          pricePerUnit: undefined, // No price
          messages: [
              { id: 'val-msg-1', sender: 'system', text: 'Donación publicada.', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
              { id: 'val-msg-2', sender: 'organization', text: '¡Reclamada! ¿Instrucciones para recoger?', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
              { id: 'val-msg-3', sender: 'business', text: 'Claro, usad la puerta lateral indicada. Podéis pasar de 9 a 5.', timestamp: new Date(new Date().setDate(new Date().getDate() - 1) + 3600000) },
          ],
          'data-ai-hint': 'lentil soup' // Specific hint
      };
    }
    // Add more mock donations or logic here if needed
     if (id === 'donation-3') { // Example claimed donation from list mock
         return {
            id: 'donation-3',
            itemName: 'Sopa de Lentejas Enlatada',
            description: 'Sopa de lentejas casera, lista para calentar.',
            quantity: 24, // Numeric quantity
            unit: 'latas', // Unit
            expirationDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
            pickupLocation: 'Almacén Central FoodLink',
            pickupInstructions: 'Entrada por puerta lateral (indicada). Aparcamiento disponible.',
            photoUrl: 'https://picsum.photos/seed/lentil_soup/400/300', // Specific hint
            postedBy: 'Empresa C',
            status: 'claimed',
            claimedBy: 'Org 1',
            postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
            claimedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
            isFree: true, // Explicitly free
            pricePerUnit: undefined, // No price
            messages: [
                { id: 'd3-msg-1', sender: 'system', text: 'Donación publicada por Empresa C.', timestamp: new Date(new Date().setDate(new Date().getDate() - 2))},
                { id: 'd3-msg-2', sender: 'organization', text: 'Hola Empresa C, hemos reclamado la sopa. ¿Podemos pasar el viernes por la mañana?', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
                { id: 'd3-msg-3', sender: 'business', text: '¡Perfecto! Viernes por la mañana está bien. Preguntad por Marta.', timestamp: new Date(new Date().setDate(new Date().getDate() - 1) + 1800000)},
            ],
            'data-ai-hint': 'lentil soup' // Specific hint
            };
     }
      // Example: Add a paid donation
      if (id === 'donation-paid-1') {
        return {
            id: `donation-paid-1`,
            itemName: 'Manzanas Fuji Frescas',
            description: 'Manzanas Fuji orgánicas, algunas con pequeñas marcas.',
            quantity: 5,
            unit: 'kg',
            expirationDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
            pickupLocation: 'Frutería La Huerta',
            pickupInstructions: 'Recoger en muelle de carga trasero. Tocar timbre.',
            photoUrl: `https://picsum.photos/seed/fuji_apples/400/300`,
            postedBy: `Empresa B`,
            status: 'claimed',
            claimedBy: `Org 2`,
            postedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
            claimedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
            isFree: false,
            pricePerUnit: 10.50, // Price in MXN$
            messages: [
                { id: 'paid-msg-1', sender: 'system', text: 'Oferta publicada.', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)) },
                { id: 'paid-msg-2', sender: 'organization', text: 'Reclamado. ¿Aceptan pago con tarjeta al recoger?', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
                { id: 'paid-msg-3', sender: 'business', text: 'Sí, aceptamos tarjeta. ¡Nos vemos!', timestamp: new Date(new Date().setDate(new Date().getDate() - 1) + 1800000) },
            ],
            'data-ai-hint': 'fuji apples'
        };
      }

      // --- Add Mocks for Message Threads ---
      // Reuse logic from MockMessagesView to generate consistent data
      const messageThreadMatch = id.match(/^msg-thread-(\d+)$/);
      if (messageThreadMatch) {
          const index = parseInt(messageThreadMatch[1], 10) - 1;
          if (index >= 0 && index < 5) { // Assuming 5 threads were generated in MockMessagesView
              const status = index % 2 === 0 ? 'claimed' : 'delivered'; // Alternate claimed/delivered
              const baseDate = new Date();
              const postedDate = new Date(baseDate.getTime() - 86400000 * (index + 3)); // Posted 3-7 days ago
              const claimedDate = new Date(postedDate.getTime() + 86400000); // Claimed 1 day after post
              const deliveredDate = status === 'delivered' ? new Date(claimedDate.getTime() + 86400000 * (index % 2 + 1)) : undefined; // Delivered 1-2 days after claim
              const isFree = index % 3 !== 0;
              const itemName = `Artículo de Prueba ${index + 1}`;
              const photoHint = index % 2 === 0 ? 'vegetables box' : 'canned goods';

              return {
                   id: id, // Use the requested ID
                   itemName: itemName,
                   description: `Descripción de ${itemName}.`,
                   quantity: (index + 1) * 5,
                   unit: index % 2 === 0 ? 'kg' : 'unidades',
                   postedBy: `Empresa ${String.fromCharCode(65 + index)}`,
                   claimedBy: `Org ${index + 1}`,
                   status: status,
                   messages: generateMockMessagesForDetail(id, status), // Generate specific messages
                   expirationDate: new Date(baseDate.getTime() + 86400000 * 5).toISOString(),
                   pickupLocation: `Ubicación de Recogida ${index + 1}`,
                   pickupInstructions: index % 2 === 0 ? 'Usar muelle trasero.' : 'Preguntar en recepción.',
                   isFree: isFree,
                   pricePerUnit: isFree ? undefined : 15.00,
                   postedAt: postedDate.toISOString(),
                   claimedAt: claimedDate.toISOString(),
                   deliveredAt: deliveredDate?.toISOString(),
                   validationCode: status === 'claimed' || status === 'delivered' ? `VAL-MSG-${index + 1}` : undefined,
                   qualityRating: status === 'delivered' ? (index % 5 + 1) : undefined,
                   photoUrl: `https://picsum.photos/seed/${photoHint.replace(/ /g, '_')}/400/300`,
                   'data-ai-hint': photoHint,
                 };
          }
      }
      // --- End Message Thread Mocks ---


    return null; // Donation not found
};
// --- End Mock Data ---


interface DonationPageProps {
  params: { id: string };
}

const DonationPage: FC<DonationPageProps> = ({ params }) => {
  const donationId = params.id;
  // Fetch donation data using the updated function
  const donation = fetchMockDonationById(donationId);


  if (!donation) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:px-6 text-center">
           <Link href="/" passHref>
                <Button variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Volver a la Lista
                 </Button>
            </Link>
          <h1 className="text-2xl font-semibold text-destructive">Donación no encontrada</h1>
          <p className="text-muted-foreground">No pudimos encontrar los detalles para la donación con ID: {donationId}</p>
        </main>
         <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-card mt-12">
            © {new Date().getFullYear()} Food Link.
         </footer>
      </div>
    );
  }

  // Assume role based on some logic or context.
  // For mocks, we can deduce based on 'claimedBy' or a hypothetical user context.
  // Here, if 'claimedBy' exists and isn't 'Tu Organización', assume business role viewing their posted item.
  // If claimedBy is 'Tu Organización', assume organization role.
  // This logic might need refinement based on actual user roles.
  let userRole: 'business' | 'organization';
  if (donation.claimedBy) {
      // Simple logic: if claimed by "Your Organization", user is org, otherwise business (viewing their posted item)
      // In a real app, this would depend on the logged-in user's actual role and relation to the donation.
      userRole = donation.claimedBy === 'Tu Organización' ? 'organization' : 'business';
  } else {
      // If not claimed, the role might be ambiguous or default to one. Let's default to business for viewing details.
      // Or perhaps only claimed items should have detail pages accessible this way.
      // For simplicity, let's assume the primary viewer is the business if not claimed by "Tu Organización"
      userRole = 'business';
  }


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-black/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center justify-between">
             <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary"/>
                Detalles y Mensajes de la Donación
            </h1>
             <Link href="/" passHref>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-1.5 h-4 w-4"/> Volver
                 </Button>
            </Link>
        </div>

        {/* Render the detail view component */}
        <DonationDetailView donation={donation} role={userRole} />

      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-card mt-12">
        © {new Date().getFullYear()} Food Link. Conectando excedentes con necesidad.
      </footer>
    </div>
  );
};

export default DonationPage;

// Optional: Generate static paths if you know the donation IDs beforehand
// export async function generateStaticParams() {
//   // Fetch all donation IDs
//   // const donations = await fetchAllDonationIds();
//   const mockIds = ['donation-val-1', 'donation-3', 'donation-paid-1']; // Example IDs including paid one
//    const messageThreadIds = Array.from({ length: 5 }, (_, i) => `msg-thread-${i + 1}`); // Add message thread IDs
//   return [...mockIds, ...messageThreadIds].map((id) => ({
//     id: id,
//   }));
// }


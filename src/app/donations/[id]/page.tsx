
// src/app/donations/[id]/page.tsx
import type { FC } from 'react';
import Header from '@/components/header';
import DonationDetailView from '@/components/donation-detail-view';
import type { Donation } from '@/types/donation'; // Assuming Donation type exists
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// --- Mock Data Fetching (Replace with actual data fetching) ---
// In a real app, you'd fetch this based on the `params.id`
const fetchMockDonationById = (id: string): Donation | null => {
   // Simple mock: return the validation mock if ID matches, otherwise null
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

    return null; // Donation not found
};
// --- End Mock Data ---


interface DonationPageProps {
  params: { id: string };
}

const DonationPage: FC<DonationPageProps> = ({ params }) => {
  const donationId = params.id;
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

  // Assume role based on some logic or context, hardcoding for now
  const userRole: 'business' | 'organization' = donation.claimedBy === 'Tu Organización' ? 'organization' : 'business'; // Example logic

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
//   return mockIds.map((id) => ({
//     id: id,
//   }));
// }

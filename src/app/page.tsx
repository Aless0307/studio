
import Header from "@/components/header";
import DonationPostForm from "@/components/donation-post-form";
import DonationList from "@/components/donation-list";
import TransactionValidation from "@/components/transaction-validation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, HeartHandshake, ListChecks, MessageSquare, PackagePlus, History, LayoutGrid } from 'lucide-react'; // Import more icons
import MockMessagesView from "@/components/mock-messages-view"; // Import the new messages component
import MockPickupProcess from "@/components/mock-pickup-process"; // Import the pickup process component
import type { Donation } from "@/types/donation"; // Import Donation type

// Mock donation for validation/rating example (adjust as needed based on DonationList updates)
const mockDonationForValidation: Donation = {
  id: `donation-val-1`,
  itemName: 'Sopa de Lentejas Enlatada',
  description: 'Sopa casera, lista para calentar.',
  quantity: 24, // Numeric quantity
  unit: 'latas', // Unit
  pricePerUnit: undefined, // Is free
  expirationDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), // Expires in 3 days
  pickupLocation: 'Almacén Central FoodLink',
  pickupInstructions: 'Entrada por puerta lateral (indicada). Aparcamiento disponible. L-V 9am-5pm.',
  photoUrl: `https://picsum.photos/seed/lentil_soup/400/300`, // Specific hint
  postedBy: `Empresa C`,
  status: 'claimed' as const,
  claimedBy: `Tu Organización`,
  postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // Posted 2 days ago
  claimedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Claimed yesterday
  deliveredAt: undefined,
  validationCode: 'VAL101',
  qualityRating: undefined,
  isFree: true,
  messages: [
      { id: 'val-msg-1', sender: 'system', text: 'Donación publicada.', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
      { id: 'val-msg-2', sender: 'organization', text: '¡Reclamada! ¿Instrucciones para recoger?', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { id: 'val-msg-3', sender: 'business', text: 'Claro, usad la puerta lateral indicada. Podéis pasar de 9 a 5.', timestamp: new Date(new Date().setDate(new Date().getDate() - 1) + 3600000) },
  ],
  'data-ai-hint': 'lentil soup' // Specific hint
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-background dark:to-black/50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <Tabs defaultValue="organization" className="w-full">
          {/* Role Switcher */}
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto mb-8 bg-muted/80 p-1 rounded-lg shadow-inner">
            <TabsTrigger value="organization" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md transition-all duration-200 ease-in-out flex items-center justify-center gap-2 py-2 text-sm font-medium">
               <HeartHandshake className="h-4 w-4"/> Organización Benéfica
            </TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md transition-all duration-200 ease-in-out flex items-center justify-center gap-2 py-2 text-sm font-medium">
                <Building className="h-4 w-4"/> Empresa Donante
            </TabsTrigger>
          </TabsList>

          {/* Organization View */}
          <TabsContent value="organization">
            <Tabs defaultValue="available" className="w-full">
               <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 mb-6 border-b pb-2">
                 <TabsTrigger value="available" className="flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"> <ListChecks className="h-4 w-4"/> Disponibles</TabsTrigger>
                 <TabsTrigger value="claimed" className="flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"><PackagePlus className="h-4 w-4"/> Mis Reclamadas</TabsTrigger>
                 <TabsTrigger value="messages" className="flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"><MessageSquare className="h-4 w-4"/> Mensajes</TabsTrigger>
                 <TabsTrigger value="history-org" className="hidden sm:flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"><History className="h-4 w-4"/> Historial</TabsTrigger>
               </TabsList>

               <TabsContent value="available">
                   <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"> <LayoutGrid className="h-6 w-6 text-primary"/> Donaciones Disponibles Para Reclamar</h2>
                   <DonationList listType="available" role="organization" />
               </TabsContent>
                <TabsContent value="claimed">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"> <PackagePlus className="h-6 w-6 text-primary"/> Mis Donaciones Reclamadas (Pendientes)</h2>
                   {/* This list will show items the org claimed but hasn't validated/rated yet */}
                   <DonationList listType="claimed" role="organization" />

                   {/* Example Pickup Process Section */}
                   <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Proceso de Recogida (Ejemplo)</h3>
                        {/* Ensure mockDonationForValidation has the required fields */}
                        <MockPickupProcess donation={mockDonationForValidation} role="organization" />
                   </div>

                   {/* Example Validation/Rating Section */}
                   <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"> <ListChecks className="h-5 w-5 text-primary"/> Validar / Calificar Recogida Reciente</h3>
                      <div className="flex justify-center">
                         <TransactionValidation
                            donation={mockDonationForValidation} // Use the same mock for consistency
                            role="organization"
                         />
                      </div>
                   </div>
               </TabsContent>
                <TabsContent value="messages">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"> <MessageSquare className="h-6 w-6 text-primary"/> Mensajes Recientes</h2>
                  {/* Pass relevant claimed donations to the messages component */}
                  <MockMessagesView role="organization" />
               </TabsContent>
                <TabsContent value="history-org">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"> <History className="h-6 w-6 text-primary"/> Historial de Donaciones (Organización)</h2>
                  <DonationList listType="history" role="organization" />
               </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Business View */}
          <TabsContent value="business">
             <Tabs defaultValue="post" className="w-full">
               <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 mb-6 border-b pb-2">
                 <TabsTrigger value="post" className="flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"><PackagePlus className="h-4 w-4"/> Publicar Nueva</TabsTrigger>
                 <TabsTrigger value="pending" className="flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"><ListChecks className="h-4 w-4"/> Pendientes</TabsTrigger>
                 <TabsTrigger value="messages-biz" className="flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"><MessageSquare className="h-4 w-4"/> Mensajes</TabsTrigger>
                  <TabsTrigger value="history-biz" className="hidden sm:flex items-center gap-1.5 justify-center text-xs sm:text-sm px-2 py-1.5"><History className="h-4 w-4"/> Historial</TabsTrigger>
               </TabsList>

                <TabsContent value="post">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Crear Nueva Oferta de Donación</h2>
                    <div className="flex justify-center">
                        <DonationPostForm />
                    </div>
                </TabsContent>
                <TabsContent value="pending">
                   <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><ListChecks className="h-6 w-6 text-primary"/> Mis Donaciones Pendientes de Recogida/Validación</h2>
                    {/* Show items posted by this business that are 'claimed' */}
                   <DonationList listType="claimed" role="business" />

                   {/* Example Validation Section */}
                   <div className="mt-8">
                       <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><PackagePlus className="h-5 w-5 text-primary"/> Validar Entrega Reciente</h3>
                       <div className="flex justify-center">
                         <TransactionValidation
                            donation={mockDonationForValidation} // Use same mock for consistency
                            role="business"
                         />
                       </div>
                   </div>
                </TabsContent>
                 <TabsContent value="messages-biz">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary"/> Mensajes Recientes</h2>
                     {/* Pass relevant claimed donations to the messages component */}
                    <MockMessagesView role="business" />
                </TabsContent>
                 <TabsContent value="history-biz">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><History className="h-6 w-6 text-primary"/> Historial de Donaciones (Empresa)</h2>
                    {/* Show delivered or expired donations posted by this business */}
                    <DonationList listType="history" role="business" />
                 </TabsContent>
             </Tabs>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-card mt-12">
        © {new Date().getFullYear()} Food Link. Conectando excedentes con necesidad. Todos los derechos reservados.
      </footer>
    </div>
  );
}

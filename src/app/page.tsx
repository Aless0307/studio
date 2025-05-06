import Header from "@/components/header";
import DonationPostForm from "@/components/donation-post-form";
import DonationList from "@/components/donation-list";
import TransactionValidation from "@/components/transaction-validation"; // Import the new component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Building, HeartHandshake, ListChecks, PackagePlus } from 'lucide-react'; // Import icons

// Mock donation for validation example (assuming one donation needs validation/rating)
const mockDonationForValidation = {
  id: `donation-val-1`,
  itemName: 'Sopa enlatada', // Translated
  description: 'Sopa de tomate, abolladuras menores en algunas latas.', // Translated
  quantity: '2 cajas', // Translated
  expirationDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), // Expires in 5 days
  pickupLocation: 'Almacén Central', // Translated
  photoUrl: `https://picsum.photos/seed/102/400/300`,
  postedBy: `Empresa C`, // Translated
  status: 'claimed' as const, // Set to claimed for validation example
  claimedBy: `Tu Organización` , // Translated
  postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // Posted 2 days ago
  claimedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Claimed yesterday
  deliveredAt: undefined,
  validationCode: 'VALID123', // Example validation code
  qualityRating: undefined, // Not yet rated
  'data-ai-hint': 'soup cans'
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Tabs defaultValue="organization" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto mb-8">
            <TabsTrigger value="organization" className="flex items-center gap-2">
               <HeartHandshake className="h-4 w-4"/> Organización {/* Translated */}
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
                <Building className="h-4 w-4"/> Empresa {/* Translated */}
            </TabsTrigger>
          </TabsList>

          {/* Organization View */}
          <TabsContent value="organization">
            <div className="space-y-8">
               <h2 className="text-2xl font-semibold flex items-center gap-2"> <ListChecks className="h-6 w-6 text-primary"/> Donaciones Disponibles</h2> {/* Translated */}
               <DonationList listType="available" role="organization" />

               {/* Example Section for Validation/Rating (for Org) */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"> <ListChecks className="h-6 w-6 text-primary"/> Calificar Recogida Reciente</h2> {/* Translated */}
                     <div className="flex justify-center">
                        {/* Pass the mock donation or a real one fetched from claimed items */}
                        <TransactionValidation
                        donation={mockDonationForValidation}
                        role="organization"
                        />
                     </div>
               </div>

                {/* Add sections for Claimed Donations, History later */}
                 {/*
                 <h2 className="text-2xl font-semibold">Mis Donaciones Reclamadas</h2> // Translated
                 <DonationList listType="claimed" role="organization" />
                 <h2 className="text-2xl font-semibold">Historial de Donaciones</h2> // Translated
                 <DonationList listType="history" role="organization" />
                 */}
            </div>
          </TabsContent>

          {/* Business View */}
          <TabsContent value="business">
            <div className="space-y-8">
              <div className="flex justify-center">
                 <DonationPostForm />
              </div>

              {/* Example Section for Validation (for Business) */}
              <div>
                 <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><PackagePlus className="h-6 w-6 text-primary"/> Validar Entrega Reciente</h2> {/* Translated */}
                  <div className="flex justify-center">
                     {/* Pass the same mock donation or one fetched from claimed/pending validation items */}
                     <TransactionValidation
                        donation={mockDonationForValidation}
                        role="business"
                        />
                  </div>
               </div>

              {/* Add sections for Posted Donations, History later */}
              {/*
              <h2 className="text-2xl font-semibold">Mis Donaciones Publicadas</h2> // Translated
              <DonationList listType="all" role="business" /> // Need to adjust DonationList for this
               <h2 className="text-2xl font-semibold">Historial de Transacciones</h2> // Translated
              <DonationList listType="history" role="business" />
              */}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t bg-card">
        © {new Date().getFullYear()} Food Link. Conectando excedentes con necesidad. {/* Translated */}
      </footer>
    </div>
  );
}

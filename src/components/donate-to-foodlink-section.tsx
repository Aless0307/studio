"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DonateToFoodlinkSectionProps {}

const DonateToFoodlinkSection: FC<DonateToFoodlinkSectionProps> = ({}) => {
  const { toast } = useToast();
  const [isLoadingUnique, setIsLoadingUnique] = useState(false);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);

  const handleDonationClick = async (type: 'única' | 'mensual') => {
    const setLoading = type === 'única' ? setIsLoadingUnique : setIsLoadingMonthly;
    setLoading(true);

    // Show initial processing toast
    toast({
      title: "Procesando tu donación...",
      description: `Estamos simulando el proceso para tu donación ${type}.`,
      variant: "default",
    });

    // Simulate API call / processing delay
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

    setLoading(false);

    // Show success toast
    toast({
      title: `¡Gracias por tu generosidad! (${type})`,
      description: type === 'única'
        ? "Tu donación única simulada ha sido registrada. ¡Cada aporte cuenta!"
        : "¡Hemos configurado tu donación mensual simulada! Tu apoyo continuo es invaluable.",
      variant: "default", // Or maybe a different variant for success if defined
      duration: 7000, // Show longer
       // You could add an action button here if needed, e.g., view donation history (mocked)
       // action: <ToastAction altText="Ver historial">Ver historial</ToastAction>,
    });

    console.log(`Simulated ${type} donation complete.`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl border border-border/50 bg-gradient-to-r from-card via-secondary/10 to-card dark:from-card dark:via-black/10 dark:to-card">
      <CardHeader className="text-center pb-4">
        <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
        <CardTitle className="text-2xl font-bold text-foreground">Apoya a FoodLink</CardTitle>
        <CardDescription className="text-muted-foreground max-w-xl mx-auto">
          Tu contribución nos ayuda a mantener y mejorar la plataforma, conectar a más organizaciones con donantes y reducir el desperdicio de alimentos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4 px-6 pb-6">
        <Button
          size="lg"
          className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-md transition-all"
          onClick={() => handleDonationClick('única')}
          disabled={isLoadingUnique || isLoadingMonthly}
        >
          {isLoadingUnique ? (
             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <DollarSign className="mr-2 h-5 w-5" />
          )}
           {isLoadingUnique ? 'Procesando...' : 'Donación Única (Simulado)'}
        </Button>
        <Button
           size="lg"
           variant="outline"
           className="w-full sm:w-auto shadow-sm transition-all"
           onClick={() => handleDonationClick('mensual')}
           disabled={isLoadingUnique || isLoadingMonthly}
         >
           {isLoadingMonthly ? (
             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
           ) : (
             <Heart className="mr-2 h-5 w-5" />
           )}
            {isLoadingMonthly ? 'Procesando...' : 'Donar Mensualmente (Simulado)'}
         </Button>
      </CardContent>
       {/* Optional Footer */}
      {/* <CardFooter className="text-xs text-muted-foreground justify-center pt-4 border-t">
         <p>FoodLink es una iniciativa sin fines de lucro.</p>
      </CardFooter> */}
    </Card>
  );
};

export default DonateToFoodlinkSection;

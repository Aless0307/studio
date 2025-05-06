
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DonateToFoodlinkSectionProps {}

const DonateToFoodlinkSection: FC<DonateToFoodlinkSectionProps> = ({}) => {
  const { toast } = useToast();

  const handleDonationClick = (type: string) => {
    // Simulate donation action (in a real app, this would integrate with a payment provider)
    console.log(`Initiating ${type} donation...`);
    toast({
      title: "¡Gracias por tu interés!",
      description: `Actualmente, las donaciones directas a FoodLink no están habilitadas en esta demostración. ¡Agradecemos tu apoyo! (${type})`,
      variant: "default",
      duration: 5000,
    });
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
          className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
          onClick={() => handleDonationClick('única')}
        >
          <DollarSign className="mr-2 h-5 w-5" /> Donación Única (Simulado)
        </Button>
        <Button
           size="lg"
           variant="outline"
           className="w-full sm:w-auto shadow-sm"
           onClick={() => handleDonationClick('mensual')}
         >
           <Heart className="mr-2 h-5 w-5" /> Donar Mensualmente (Simulado)
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

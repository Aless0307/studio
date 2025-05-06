
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, DollarSign, Loader2, CreditCard, ShieldCheck, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface DonateToFoodlinkSectionProps {}

const predefinedAmounts = [50, 100, 250, 500]; // MXN$

const DonateToFoodlinkSection: FC<DonateToFoodlinkSectionProps> = ({}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationType, setDonationType] = useState<'única' | 'mensual' | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(predefinedAmounts[1]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleOpenDialog = (type: 'única' | 'mensual') => {
    setDonationType(type);
    setSelectedAmount(predefinedAmounts[1]); // Reset to default
    setCustomAmount('');
    setIsAnonymous(false);
    setPaymentMethod('card');
    setIsDialogOpen(true);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // Clear custom amount if predefined is selected
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      setSelectedAmount(parseFloat(value)); // Update selected amount for processing
    } else if (!value) {
      setSelectedAmount(0); // Or some default / prevent processing if invalid
    }
  };


  const processDonation = async () => {
    if (!donationType) return;
    if (selectedAmount <= 0 && !customAmount) {
        toast({
            title: "Monto Inválido",
            description: "Por favor, selecciona o ingresa un monto válido para donar.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    setIsDialogOpen(false);

    const amountToDonate = parseFloat(customAmount) || selectedAmount;

    toast({
      title: "Procesando tu donación...",
      description: `Simulando el proceso para tu donación ${donationType} de MXN$ ${amountToDonate.toFixed(2)}. ${isAnonymous ? '(Anónima)' : ''} Vía ${paymentMethod === 'card' ? 'Tarjeta' : 'PayPal'}.`,
      variant: "default",
    });

    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API call

    setIsLoading(false);

    toast({
      title: `¡Gracias por tu generosidad! (${donationType})`,
      description: `Tu donación simulada de MXN$ ${amountToDonate.toFixed(2)} ha sido registrada. ${isAnonymous ? 'Agradecemos tu contribución anónima.' : 'Tu apoyo es muy valioso.'} ¡Cada aporte cuenta!`,
      variant: "default",
      duration: 7000,
    });

    console.log(`Simulated ${donationType} donation of MXN$${amountToDonate.toFixed(2)} (Anonymous: ${isAnonymous}, Payment: ${paymentMethod}) complete.`);
    // Reset states
    setDonationType(null);
    setCustomAmount('');
    setSelectedAmount(predefinedAmounts[1]);
  };

  const openContactDialog = () => {
    setContactDialogOpen(true);
  }

  return (
    <>
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
            onClick={() => handleOpenDialog('única')}
            disabled={isLoading}
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Donación Única
          </Button>
          <Button
             size="lg"
             variant="outline"
             className="w-full sm:w-auto shadow-sm transition-all"
             onClick={() => handleOpenDialog('mensual')}
             disabled={isLoading}
           >
             <Heart className="mr-2 h-5 w-5" />
             Donar Mensualmente
           </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground justify-center pt-4 border-t">
           <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground hover:text-primary" onClick={openContactDialog}>
              ¿Prefieres otras formas de donar o tienes preguntas? Contáctanos.
            </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                {donationType === 'única' ? <DollarSign className="h-5 w-5 text-primary"/> : <Heart className="h-5 w-5 text-primary"/>}
                Realizar Donación {donationType === 'única' ? 'Única' : 'Mensual'}
            </DialogTitle>
            <DialogDescription>
              Selecciona el monto y método de pago para tu donación {donationType}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="amount" className="mb-2 block font-medium">Monto (MXN$):</Label>
              <RadioGroup
                value={customAmount ? 'custom' : selectedAmount.toString()}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setSelectedAmount(0); // Let customAmount drive it
                  } else {
                    handleAmountSelect(parseInt(value));
                  }
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2"
              >
                {predefinedAmounts.map(amount => (
                  <Label
                    key={amount}
                    htmlFor={`amount-${amount}`}
                    className={cn(
                      "border rounded-md p-3 text-center cursor-pointer transition-colors hover:bg-accent/10",
                      selectedAmount === amount && !customAmount ? "bg-accent text-accent-foreground border-accent ring-2 ring-ring" : "bg-background border-border"
                    )}
                  >
                    <RadioGroupItem value={amount.toString()} id={`amount-${amount}`} className="sr-only" />
                    ${amount}
                  </Label>
                ))}
              </RadioGroup>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Otro monto"
                value={customAmount}
                onChange={handleCustomAmountChange}
                min="10" // Minimum custom amount
                className="w-full"
              />
            </div>

            <div>
                <Label htmlFor="paymentMethod" className="mb-2 block font-medium">Método de Pago (Simulado):</Label>
                <RadioGroup
                    defaultValue="card"
                    value={paymentMethod}
                    onValueChange={(val: 'card' | 'paypal') => setPaymentMethod(val)}
                    className="flex gap-4"
                >
                    <Label htmlFor="card" className={cn("flex items-center gap-2 border rounded-md p-3 cursor-pointer transition-colors hover:bg-accent/10 flex-1", paymentMethod === 'card' ? "bg-accent text-accent-foreground border-accent ring-2 ring-ring" : "bg-background border-border")}>
                        <RadioGroupItem value="card" id="card" className="sr-only" />
                        <CreditCard className="h-5 w-5"/> Tarjeta
                    </Label>
                    <Label htmlFor="paypal" className={cn("flex items-center gap-2 border rounded-md p-3 cursor-pointer transition-colors hover:bg-accent/10 flex-1", paymentMethod === 'paypal' ? "bg-accent text-accent-foreground border-accent ring-2 ring-ring" : "bg-background border-border")}>
                        <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.03125 16.2188C7.03125 16.2188 7.03125 16.2188 7.03125 16.2188C6.71875 16.2188 6.46875 16 6.46875 15.6562V10.0312C6.46875 9.90625 6.46875 9.78125 6.5 9.65625L7.53125 3.40625C7.59375 3.15625 7.84375 2.96875 8.125 2.96875H14.4375C14.7188 2.96875 14.9688 3.15625 15.0312 3.40625L15.625 7.1875H13.25C12.9688 7.1875 12.75 7.40625 12.75 7.6875V8.09375C12.75 8.375 12.9688 8.59375 13.25 8.59375H15.5312C14.7188 11.7812 12.625 12.6562 10.0312 12.6562H8.59375V15.6562C8.59375 16 8.3125 16.2188 8 16.2188H7.03125ZM10.4375 8.59375H12V7.1875H10.0312L9.28125 4.375H8.71875L8.03125 8.59375H10.4375ZM15.8438 2.96875H19.5938C20.2188 2.96875 20.7188 3.46875 20.7188 4.0625V6.125C20.7188 6.65625 20.3125 7.09375 19.7812 7.15625L16.5312 7.53125C16.2188 7.5625 15.9688 7.34375 15.9688 7.03125V4.0625C15.9688 3.71875 15.8438 3.40625 15.6562 3.1875C15.7188 3.0625 15.7812 2.96875 15.8438 2.96875ZM16.7188 10.7812C17.8125 10.7812 18.7188 9.96875 18.7188 8.875C18.7188 8.75 18.7188 8.65625 18.6875 8.53125L17.8125 3.8125C17.75 3.5625 17.9375 3.34375 18.1875 3.34375H18.75C19.0312 3.34375 19.25 3.5625 19.25 3.84375L19.6562 6.4375C19.6875 6.625 19.8438 6.78125 20.0312 6.78125H20.25C20.5312 6.78125 20.75 6.5625 20.75 6.28125V4.21875C20.75 3.5625 20.25 3.03125 19.5938 3.03125H16.25C16.1875 3.03125 16.125 3.03125 16.0938 3.0625C16.0312 3.09375 16 3.15625 16 3.21875V6.875C16 7.15625 16.2188 7.375 16.5 7.375L19.5312 7C19.9062 6.9375 20.1875 6.59375 20.1875 6.21875V4.21875C20.1875 4.03125 20.0312 3.875 19.8438 3.875H19.6562C19.375 3.875 19.1562 4.09375 19.1562 4.375L18.2812 9.09375C18.2188 9.40625 17.9688 9.625 17.6562 9.625C16.9375 9.625 16.7188 10.0938 16.7188 10.7812Z" /></svg>
                        PayPal
                    </Label>
                </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(checked as boolean)} />
              <Label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Deseo que mi donación sea anónima
              </Label>
            </div>

             <div className="text-xs text-muted-foreground p-3 border rounded-md bg-secondary/50">
                <ShieldCheck className="inline h-4 w-4 mr-1.5 text-primary" />
                Estás en un entorno de simulación seguro. Ningún pago real será procesado.
             </div>

          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={processDonation} disabled={isLoading || (!customAmount && selectedAmount <= 0)}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Procesando...' : `Donar MXN$ ${(parseFloat(customAmount) || selectedAmount).toFixed(2)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary"/>Contacta con FoodLink</DialogTitle>
                        <DialogDescription>
                            Gracias por tu interés en apoyar nuestra misión.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <p className="text-sm">
                            Para donaciones mayores, patrocinios, alianzas estratégicas u otras formas de colaboración, por favor envíanos un correo electrónico a:
                        </p>
                        <p className="font-semibold text-primary text-center text-lg">
                            <a href="mailto:donaciones@foodlink.org.sim" className="hover:underline">
                                donaciones@foodlink.org.sim
                            </a>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            (Este es un correo de simulación. En un entorno real, aquí encontrarías información de contacto válida.)
                        </p>
                        <p className="text-sm">
                            ¡Tu apoyo hace una gran diferencia!
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    </>
  );
};

export default DonateToFoodlinkSection;

    
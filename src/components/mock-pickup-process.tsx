
"use client";

import type { FC } from 'react';
import { Check, Clock, MapPin, MessageSquare, Package, Star, HelpCircle } from 'lucide-react';
import type { Donation } from '@/types/donation'; // Use updated Donation type
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from './ui/button';
import Link from 'next/link';

interface MockPickupProcessProps {
  donation: Donation;
  role: 'business' | 'organization';
}

const MockPickupProcess: FC<MockPickupProcessProps> = ({ donation, role }) => {
  // Determine current step based on donation status
  let currentStep = 0;
  if (donation.status === 'claimed') currentStep = 1;
  if (donation.deliveredAt) currentStep = 2; // Assume delivery implies pickup occurred
  if (donation.validationCode && !donation.deliveredAt && role === 'business') currentStep = 2; // Business waiting for validation
  if (donation.qualityRating && role === 'organization') currentStep = 3; // Org has rated

  const steps = [
    {
      id: 1,
      title: "Coordinar Recogida",
      description: "Usa los mensajes para acordar día y hora.",
      icon: MessageSquare,
      status: currentStep >= 1 ? 'completed' : currentStep === 0 ? 'current' : 'pending',
      action: <Link href={`/donations/${donation.id}`} passHref legacyBehavior><Button variant="link" size="sm" className="text-xs p-0 h-auto">Ir a Mensajes</Button></Link>
    },
    {
      id: 2,
      title: "Realizar Recogida",
      description: `Ir a ${donation.pickupLocation}. Seguir instrucciones.`,
      icon: MapPin,
       status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'current' : 'pending',
       action: donation.pickupInstructions ? <span className="text-xs text-muted-foreground italic">{donation.pickupInstructions}</span> : null
    },
    {
      id: 3,
      title: "Validar y Calificar",
      description: role === 'organization' ? "Confirma la recogida y valora la calidad." : "Espera la validación de la organización.",
      icon: role === 'organization' ? Star : Check,
       status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'current' : 'pending',
       action: <span className="text-xs text-muted-foreground">Usa la sección de abajo.</span>
    },
     {
      id: 4,
      title: "¡Completado!",
      description: "La transacción ha finalizado con éxito.",
      icon: Package,
       status: currentStep >= 3 ? 'completed' : 'pending',
       action: null
    },
  ];

  return (
    <Card className="shadow-md border-border/40 bg-secondary/30">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Estado de la Recogida</CardTitle>
         <CardDescription>Pasos para completar la transacción de "{donation.itemName}".</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3 sm:gap-4 relative">
                {/* Connecting line */}
               {index < steps.length -1 && (
                 <div className={`absolute left-4 top-8 h-[calc(100%-1rem)] w-0.5 ${step.status === 'completed' ? 'bg-primary' : 'bg-border'}`} />
               )}
              {/* Icon and Badge */}
              <div className="flex flex-col items-center z-10">
                 <div className={`rounded-full p-2 flex items-center justify-center border-2 ${
                      step.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' :
                      step.status === 'current' ? 'bg-accent border-accent text-accent-foreground animate-pulse' :
                      'bg-card border-border text-muted-foreground'
                    }`}>
                     <step.icon className="h-4 w-4" />
                 </div>
              </div>
              {/* Step Details */}
              <div className="flex-1 pt-1">
                <h4 className={`font-medium ${
                    step.status === 'completed' ? 'text-foreground' :
                    step.status === 'current' ? 'text-accent-foreground font-semibold' :
                    'text-muted-foreground'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-sm ${step.status === 'pending' ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>{step.description}</p>
                 {step.action && <div className="mt-1">{step.action}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MockPickupProcess;

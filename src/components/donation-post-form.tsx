"use client";

import type { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Image as ImageIcon, MapPin, Package, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale'; // Import Spanish locale

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  itemName: z.string().min(2, {
    message: "El nombre del artículo debe tener al menos 2 caracteres.", // Translated message
  }),
  description: z.string().optional(),
  quantity: z.string().min(1, { message: "La cantidad es requerida." }), // Translated message
  expirationDate: z.date({
    required_error: "La fecha de expiración es requerida.", // Translated message
  }),
  pickupLocation: z.string().min(5, {
    message: "La ubicación de recogida debe tener al menos 5 caracteres.", // Translated message
  }),
  // Simple file input for now, real implementation would need more handling
  photo: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DonationPostFormProps {}

const DonationPostForm: FC<DonationPostFormProps> = ({}) => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      description: "",
      quantity: "",
      pickupLocation: "",
      photo: null,
    },
  });

  async function onSubmit(values: FormData) {
    // Simulate API call / Server Action
    console.log("Enviando donación:", values); // Translated log
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

    // Display success toast
     toast({
      title: "¡Donación Publicada!", // Translated
      description: `Tu donación de ${values.itemName} ha sido listada.`, // Translated
    });

    // Reset form after successful submission
    form.reset();
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlusCircle className="h-6 w-6 text-primary" />
          Publicar Nueva Donación de Alimentos {/* Translated */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Package className="h-4 w-4"/>Nombre del Artículo</FormLabel> {/* Translated */}
                  <FormControl>
                    <Input placeholder="Ej., Panes, Manzanas Frescas" {...field} /> {/* Translated */}
                  </FormControl>
                  <FormDescription>
                    El nombre del alimento que se dona. {/* Translated */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel> {/* Translated */}
                  <FormControl>
                    <Textarea
                      placeholder="Proporciona detalles adicionales (ej., marca, tipo específico)" // Translated
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel> {/* Translated */}
                  <FormControl>
                    <Input placeholder="Ej., 10 panes, 5 kg, 2 cajas" {...field} /> {/* Translated */}
                  </FormControl>
                   <FormDescription>
                    Especifica la cantidad disponible. {/* Translated */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-1"><CalendarIcon className="h-4 w-4"/>Fecha de Expiración</FormLabel> {/* Translated */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es }) // Use Spanish locale
                          ) : (
                            <span>Elige una fecha</span> // Translated
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={es} // Set locale for Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    La fecha de 'consumo preferente' o expiración del artículo. {/* Translated */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4"/>Ubicación de Recogida</FormLabel> {/* Translated */}
                  <FormControl>
                    <Input placeholder="Ingresa la dirección de tu negocio" {...field} /> {/* Translated */}
                  </FormControl>
                   <FormDescription>
                    Dónde se puede recoger la donación. {/* Translated */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4"/>Subir Foto (Opcional)</FormLabel> {/* Translated */}
                  <FormControl>
                     {/* Basic file input - needs improvement for previews, etc. */}
                    <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                  </FormControl>
                  <FormDescription>
                    Una foto ayuda a las organizaciones a ver el artículo. {/* Translated */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Publicando..." : "Publicar Donación"} {/* Translated */}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonationPostForm;

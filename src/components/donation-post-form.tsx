
"use client";

import type { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Image as ImageIcon, MapPin, Package, PlusCircle, Info, BadgePercent, HandCoins } from "lucide-react";
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
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Label } from "@/components/ui/label"; // Import Label for Switch
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  itemName: z.string().min(3, {
    message: "El nombre del artículo debe tener al menos 3 caracteres.", // Spanish
  }),
  description: z.string().optional(),
  quantity: z.string().min(1, { message: "La cantidad es requerida." }), // Spanish
  expirationDate: z.date({
    required_error: "La fecha de caducidad es requerida.", // Spanish
  }),
  pickupLocation: z.string().min(5, {
    message: "La ubicación de recogida debe tener al menos 5 caracteres.", // Spanish
  }),
  pickupInstructions: z.string().optional(), // New field
  isFree: z.boolean().default(true), // New field, default to true
  // Simple file input for now, real implementation would need more handling
  photo: z.any().optional(), // Consider using a library for better file handling
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
      pickupInstructions: "", // Default empty
      isFree: true, // Default free
      photo: null,
    },
  });

   // Watch the value of isFree to update UI potentially
   const isFreeValue = form.watch('isFree');

  async function onSubmit(values: FormData) {
    // Simulate API call / Server Action
    console.log("Publicando donación:", values); // Spanish log
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

    // Display success toast
     toast({
      title: "¡Donación Publicada!", // Spanish
      description: `Tu ${values.isFree ? 'donación gratuita' : 'oferta con precio simbólico'} de ${values.itemName} ha sido listada correctamente.`, // Spanish, dynamic based on isFree
      variant: "default", // Use default variant for success
    });

    // Reset form after successful submission
    form.reset();
     // Ensure isFree defaults back to true after reset
     form.setValue('isFree', true);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-secondary/10 dark:from-card dark:to-black/20">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-foreground">
          <PlusCircle className="h-6 w-6 text-primary flex-shrink-0" />
          Publicar Nueva Donación {/* Spanish */}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Item Name */}
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><Package className="h-4 w-4"/>Nombre del Artículo *</FormLabel> {/* Spanish */}
                  <FormControl>
                    <Input placeholder="Ej., Pan del día anterior, Manzanas Fuji" {...field} /> {/* Spanish */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* isFree Switch */}
             <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50">
                  <div className="space-y-0.5">
                     <FormLabel className="flex items-center gap-1.5">
                        {field.value ? <BadgePercent className="h-4 w-4 text-green-600"/> : <HandCoins className="h-4 w-4 text-orange-600"/> }
                        {field.value ? 'Ofrecer Gratis' : 'Precio Simbólico'}
                    </FormLabel>
                     <FormDescription className="text-xs">
                        {field.value
                            ? "La donación se ofrecerá sin coste alguno."
                            : "Se solicitará una pequeña aportación simbólica (no gestionado aquí)."}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />


            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Descripción (Opcional)</FormLabel> {/* Spanish */}
                  <FormControl>
                    <Textarea
                      placeholder="Añade detalles útiles: marca, estado, tamaño, ingredientes..." // Spanish
                      className="resize-y min-h-[60px]" // Allow vertical resize
                      {...field}
                      value={field.value ?? ''} // Ensure value is never null/undefined for textarea
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Cantidad *</FormLabel> {/* Spanish */}
                  <FormControl>
                    <Input placeholder="Ej., 10 panes, 5 kg, 2 cajas" {...field} /> {/* Spanish */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Expiration Date */}
             <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><CalendarIcon className="h-4 w-4"/>Fecha de Caducidad *</FormLabel> {/* Spanish */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal", // Changed alignment
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" /> {/* Moved icon left */}
                          {field.value ? (
                            format(field.value, "PPP", { locale: es }) // Use Spanish locale
                          ) : (
                            <span>Selecciona una fecha</span> // Spanish
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={es} // Set locale for Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => // Disable past dates
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs">
                    Fecha de 'consumo preferente' o caducidad. {/* Spanish */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Pickup Location */}
            <FormField
              control={form.control}
              name="pickupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><MapPin className="h-4 w-4"/>Ubicación de Recogida *</FormLabel> {/* Spanish */}
                  <FormControl>
                    <Input placeholder="Dirección completa o punto de referencia" {...field} /> {/* Spanish */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Pickup Instructions */}
            <FormField
              control={form.control}
              name="pickupInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><Info className="h-4 w-4"/>Instrucciones de Recogida (Opcional)</FormLabel> {/* Spanish */}
                  <FormControl>
                     <Textarea
                      placeholder="Ej., Horario, persona de contacto, muelle de carga, indicaciones especiales..." // Spanish
                      className="resize-y min-h-[60px]"
                      {...field}
                       value={field.value ?? ''} // Ensure value is never null/undefined
                    />
                  </FormControl>
                   <FormDescription className="text-xs">
                     Detalles para facilitar la recogida a la organización. {/* Spanish */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Photo Upload */}
             <FormField
              control={form.control}
              name="photo"
              render={({ field: { onChange, value, ...rest } }) => ( // Destructure field properly for file input
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><ImageIcon className="h-4 w-4"/>Subir Foto (Opcional)</FormLabel> {/* Spanish */}
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} // Use onChange from renderProps
                      className="file:text-foreground"
                       {...rest} // Pass rest of field props
                     />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Una imagen clara ayuda mucho. Máximo 5MB. {/* Spanish */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-base font-semibold shadow-md transition-all duration-200 ease-in-out hover:shadow-lg active:scale-[0.98]" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Publicando..." : "Publicar Donación"} {/* Spanish */}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonationPostForm;

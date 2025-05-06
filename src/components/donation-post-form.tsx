
"use client";

import type { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Image as ImageIcon, MapPin, Package, PlusCircle, Info, BadgePercent, HandCoins, Weight, Box, Tag } from "lucide-react"; // Added more icons
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select for units

const formSchema = z.object({
  itemName: z.string().min(3, {
    message: "El nombre del artículo debe tener al menos 3 caracteres.",
  }),
  description: z.string().optional(),
  quantity: z.coerce.number().positive({ message: "La cantidad debe ser un número positivo." }), // Ensure positive number
  unit: z.string().min(1, { message: "La unidad es requerida." }), // Add unit field
  expirationDate: z.date({
    required_error: "La fecha de caducidad es requerida.",
  }),
  pickupLocation: z.string().min(5, {
    message: "La ubicación de recogida debe tener al menos 5 caracteres.",
  }),
  pickupInstructions: z.string().optional(),
  isFree: z.boolean().default(true),
  pricePerUnit: z.coerce.number().positive({ message: "El precio debe ser un número positivo." }).optional(), // Optional positive number
  photo: z.any().optional(),
}).refine(data => data.isFree || data.pricePerUnit !== undefined, { // If not free, price is required
  message: "Debe indicar un precio por unidad si la donación no es gratuita.",
  path: ["pricePerUnit"],
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
      quantity: undefined, // Default to undefined for numeric input
      unit: "", // Default empty unit
      pickupLocation: "",
      pickupInstructions: "",
      isFree: true,
      pricePerUnit: undefined,
      photo: null,
    },
  });

  const isFreeValue = form.watch('isFree');

  async function onSubmit(values: FormData) {
    // Simulate API call / Server Action
    const finalValues = {
        ...values,
        pricePerUnit: values.isFree ? undefined : values.pricePerUnit, // Ensure price is undefined if free
    };
    console.log("Publicando donación:", finalValues);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

    // Display success toast
     toast({
      title: "¡Donación Publicada!",
      description: `Tu ${finalValues.isFree ? 'donación gratuita' : 'oferta con precio simbólico'} de ${finalValues.itemName} ha sido listada correctamente.`,
      variant: "default",
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
          Publicar Nueva Donación
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
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><Package className="h-4 w-4"/>Nombre del Artículo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej., Pan del día anterior, Manzanas Fuji" {...field} />
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
                        {field.value ? 'Ofrecer Gratis' : 'Establecer Precio Simbólico'}
                    </FormLabel>
                     <FormDescription className="text-xs">
                        {field.value
                            ? "La donación se ofrecerá sin coste alguno."
                            : "Se solicitará una pequeña aportación simbólica por unidad."}
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

            {/* Price Per Unit (Conditional) */}
            {!isFreeValue && (
              <FormField
                control={form.control}
                name="pricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><Tag className="h-4 w-4"/>Precio por Unidad (€) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej., 0.50" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                       Indica el precio simbólico por cada unidad (kg, lata, etc.).
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}


            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Añade detalles útiles: marca, estado, tamaño, ingredientes..."
                      className="resize-y min-h-[60px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><Box className="h-4 w-4"/>Cantidad Total *</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ej., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                 {/* Unit */}
                <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><Weight className="h-4 w-4"/>Unidad *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona unidad" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                            <SelectItem value="litros">Litros (l)</SelectItem>
                            <SelectItem value="unidades">Unidades</SelectItem>
                            <SelectItem value="latas">Latas</SelectItem>
                            <SelectItem value="paquetes">Paquetes</SelectItem>
                            <SelectItem value="cajas">Cajas</SelectItem>
                            <SelectItem value="bolsas">Bolsas</SelectItem>
                            <SelectItem value="bandejas">Bandejas</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
             </div>

             {/* Expiration Date */}
             <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><CalendarIcon className="h-4 w-4"/>Fecha de Caducidad *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={es}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs">
                    Fecha de 'consumo preferente' o caducidad.
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
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><MapPin className="h-4 w-4"/>Ubicación de Recogida *</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección completa o punto de referencia" {...field} />
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
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><Info className="h-4 w-4"/>Instrucciones de Recogida (Opcional)</FormLabel>
                  <FormControl>
                     <Textarea
                      placeholder="Ej., Horario, persona de contacto, muelle de carga, indicaciones especiales..."
                      className="resize-y min-h-[60px]"
                      {...field}
                       value={field.value ?? ''}
                    />
                  </FormControl>
                   <FormDescription className="text-xs">
                     Detalles para facilitar la recogida a la organización.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Photo Upload */}
             <FormField
              control={form.control}
              name="photo"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium"><ImageIcon className="h-4 w-4"/>Subir Foto (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                      className="file:text-foreground"
                       {...rest}
                     />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Una imagen clara ayuda mucho. Máximo 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-base font-semibold shadow-md transition-all duration-200 ease-in-out hover:shadow-lg active:scale-[0.98]" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Publicando..." : "Publicar Donación"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonationPostForm;

"use client";

import type { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Image as ImageIcon, MapPin, Package, PlusCircle } from "lucide-react";
import { format } from "date-fns";

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
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  quantity: z.string().min(1, { message: "Quantity is required." }),
  expirationDate: z.date({
    required_error: "Expiration date is required.",
  }),
  pickupLocation: z.string().min(5, {
    message: "Pickup location must be at least 5 characters.",
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
    console.log("Submitting donation:", values);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

    // Display success toast
     toast({
      title: "Donation Posted!",
      description: `Your donation of ${values.itemName} has been listed.`,
    });

    // Reset form after successful submission
    form.reset();
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlusCircle className="h-6 w-6 text-primary" />
          Post a New Food Donation
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
                  <FormLabel className="flex items-center gap-1"><Package className="h-4 w-4"/>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bread Loaves, Fresh Apples" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the food item being donated.
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide any additional details (e.g., brand, specific type)"
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
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10 loaves, 5 kg, 2 boxes" {...field} />
                  </FormControl>
                   <FormDescription>
                    Specify the amount available.
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
                  <FormLabel className="flex items-center gap-1"><CalendarIcon className="h-4 w-4"/>Expiration Date</FormLabel>
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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
                    The 'best before' or expiration date of the item.
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
                  <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4"/>Pickup Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business address" {...field} />
                  </FormControl>
                   <FormDescription>
                    Where the donation can be collected from.
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
                  <FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4"/>Upload Photo (Optional)</FormLabel>
                  <FormControl>
                     {/* Basic file input - needs improvement for previews, etc. */}
                    <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                  </FormControl>
                  <FormDescription>
                    A photo helps organizations see the item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Posting..." : "Post Donation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonationPostForm;

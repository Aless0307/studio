"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle, QrCode, Star, ThumbsDown, ThumbsUp } from 'lucide-react';

import type { Donation } from '@/types/donation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription, // Added FormDescription import
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Separator } from './ui/separator';

interface TransactionValidationProps {
  donation: Donation; // The specific donation being validated/rated
  role: 'business' | 'organization';
  onValidationComplete?: (donationId: string, validationCode?: string) => void;
  onRatingComplete?: (donationId: string, rating: number) => void;
}

// --- Business Validation Form ---
const validationSchema = z.object({
  validationCode: z.string().min(4, { message: "Code must be at least 4 characters." }).max(10, { message: "Code cannot exceed 10 characters." }),
});
type ValidationFormData = z.infer<typeof validationSchema>;

const BusinessValidationForm: FC<{ donation: Donation, onSubmit: (code: string) => Promise<void> }> = ({ donation, onSubmit }) => {
  const form = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { validationCode: "" },
  });

  const handleSubmit = async (values: ValidationFormData) => {
    await onSubmit(values.validationCode);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="validationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1"><QrCode className="h-4 w-4"/>Enter Validation Code</FormLabel>
              <FormControl>
                <Input placeholder="Code provided by organization" {...field} />
              </FormControl>
              <FormDescription>
                Confirm delivery by entering the code from the recipient.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Validating..." : "Validate Delivery"}
        </Button>
      </form>
    </Form>
  );
}

// --- Organization Rating Form ---
const ratingSchema = z.object({
  rating: z.string().refine(val => ['1', '2', '3', '4', '5'].includes(val), {
      message: "Please select a rating.",
  }),
});
type RatingFormData = z.infer<typeof ratingSchema>;


const OrganizationRatingForm: FC<{ donation: Donation, onSubmit: (rating: number) => Promise<void> }> = ({ donation, onSubmit }) => {
    const form = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
  });

   const handleSubmit = async (values: RatingFormData) => {
    await onSubmit(parseInt(values.rating, 10));
     form.reset(); // Optionally reset after submit
  };

  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel className="flex items-center gap-1"><Star className="h-4 w-4"/>Rate Donation Quality</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex justify-around p-2 border rounded-lg bg-secondary"
                    >
                    {[1, 2, 3, 4, 5].map(value => (
                         <FormItem key={value} className="flex flex-col items-center space-y-1">
                             <FormControl>
                                <RadioGroupItem value={String(value)} id={`rating-${value}`} className="sr-only" />
                             </FormControl>
                              <FormLabel htmlFor={`rating-${value}`} className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${field.value === String(value) ? 'bg-primary text-primary-foreground scale-110' : 'hover:bg-muted'}`}>
                                <Star className={`h-6 w-6 ${field.value === String(value) ? 'fill-current' : ''}`} />
                                <span className="text-xs mt-1">{value}</span>
                              </FormLabel>
                        </FormItem>
                    ))}
                    </RadioGroup>
                </FormControl>
                 <FormDescription className="text-center">
                    1 = Poor, 5 = Excellent
                 </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
             <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? "Submitting..." : "Submit Rating"}
            </Button>
        </form>
     </Form>
  );
}


const TransactionValidation: FC<TransactionValidationProps> = ({ donation, role, onValidationComplete, onRatingComplete }) => {
  const { toast } = useToast();
  const [isValidated, setIsValidated] = useState(donation.status === 'delivered'); // Assume delivered means validated for initial state
  const [isRated, setIsRated] = useState(!!donation.qualityRating);

  const handleValidationSubmit = async (code: string) => {
      console.log(`Validating donation ${donation.id} with code: ${code}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = code === 'VALID123'; // Mock validation logic

      if (success) {
          setIsValidated(true);
          onValidationComplete?.(donation.id, code);
          toast({
              title: "Delivery Validated!",
              description: `Donation ${donation.itemName} marked as delivered.`,
          });
      } else {
          toast({
              title: "Validation Failed",
              description: "The entered code is incorrect. Please try again.",
              variant: "destructive",
          });
      }
  };

   const handleRatingSubmit = async (rating: number) => {
      console.log(`Rating donation ${donation.id} with: ${rating} stars`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsRated(true);
      onRatingComplete?.(donation.id, rating);
       toast({
        title: "Rating Submitted!",
        description: `Thank you for rating the quality of ${donation.itemName}.`,
      });
  };


  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-5 w-5 text-primary"/>
            Transaction Details
        </CardTitle>
        <CardDescription>
          Validate delivery and rate the donation for: <span className="font-medium">{donation.itemName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business View: Validate Delivery */}
        {role === 'business' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Validate Delivery</h3>
            {isValidated ? (
               <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
                    <ThumbsUp className="h-5 w-5" />
                    <span>Delivery already validated.</span>
                </div>
            ) : donation.status === 'claimed' ? (
              <BusinessValidationForm donation={donation} onSubmit={handleValidationSubmit} />
            ) : (
                 <p className="text-sm text-muted-foreground italic">Waiting for the organization to pick up the donation.</p>
            )}
          </div>
        )}

         {/* Separator between sections if both might appear (though unlikely in same view) */}
        {role === 'business' && <Separator />}

        {/* Organization View: Rate Donation */}
        {role === 'organization' && (
           <div>
            <h3 className="text-lg font-semibold mb-2">Rate Donation Quality</h3>
            {isRated ? (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                    <Star className="h-5 w-5 fill-current" />
                    <span>Thank you for your rating! ({donation.qualityRating || 'Rated'})</span>
                </div>
            ) : isValidated || donation.status === 'delivered' ? ( // Only allow rating after delivery is confirmed/validated
                <OrganizationRatingForm donation={donation} onSubmit={handleRatingSubmit} />
             ) : (
                 <p className="text-sm text-muted-foreground italic">Please confirm pickup or wait for delivery validation before rating.</p>
             )}
           </div>
        )}

        {/* Show a message if the role doesn't match expected actions */}
         {role !== 'business' && role !== 'organization' && (
             <p className="text-sm text-muted-foreground italic">No actions available for this role.</p>
         )}

      </CardContent>
      {/* Optional Footer */}
      {/* <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">Transaction ID: {donation.id}</p>
      </CardFooter> */}
    </Card>
  );
};

export default TransactionValidation;

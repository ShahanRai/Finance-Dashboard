
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  lenderName: z.string().min(1, 'Lender name is required'),
  loanAmount: z.string().min(1, 'Loan amount is required'),
  interestRate: z.string().optional(),
  tenureMonths: z.string().min(1, 'Tenure is required'),
  emiStartDate: z.string().optional(),
  emiDate: z.string().optional(),
  vehicleDetails: z.string().optional(),
  propertyAddress: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

interface EditEMIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEMI: any;
  onDataChanged?: () => void;
}

export const EditEMIModal: React.FC<EditEMIModalProps> = ({ 
  open, 
  onOpenChange, 
  editEMI, 
  onDataChanged 
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      lenderName: '',
      loanAmount: '',
      interestRate: '',
      tenureMonths: '',
      emiStartDate: '',
      emiDate: '',
      vehicleDetails: '',
      propertyAddress: '',
      purpose: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (editEMI && open) {
      let parsedDescription = {};
      try {
        parsedDescription = typeof editEMI.description === 'string' 
          ? JSON.parse(editEMI.description) 
          : editEMI.description || {};
      } catch (e) {
        console.error('Error parsing EMI description:', e);
      }

      form.reset({
        category: editEMI.category || '',
        lenderName: (parsedDescription as any).lenderName || '',
        loanAmount: (parsedDescription as any).loanAmount || '',
        interestRate: (parsedDescription as any).interestRate || '',
        tenureMonths: (parsedDescription as any).tenureMonths || '',
        emiStartDate: (parsedDescription as any).emiStartDate || '',
        emiDate: (parsedDescription as any).emiDate || '',
        vehicleDetails: (parsedDescription as any).vehicleDetails || '',
        propertyAddress: (parsedDescription as any).propertyAddress || '',
        purpose: (parsedDescription as any).purpose || '',
        notes: (parsedDescription as any).notes || '',
      });
    }
  }, [editEMI, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !editEMI) return;
    
    setLoading(true);

    try {
      const loanAmount = parseFloat(values.loanAmount);
      const tenureMonths = parseInt(values.tenureMonths);
      const interestRate = parseFloat(values.interestRate || '0');
      
      // Calculate EMI using standard formula: P * r * (1+r)^n / ((1+r)^n - 1)
      let monthlyEMI = 0;
      if (interestRate > 0) {
        const monthlyRate = interestRate / 100 / 12;
        monthlyEMI = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                     (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      } else {
        monthlyEMI = loanAmount / tenureMonths;
      }

      const updatedDescription = {
        lenderName: values.lenderName,
        loanAmount: values.loanAmount,
        interestRate: values.interestRate,
        tenureMonths: values.tenureMonths,
        emiStartDate: values.emiStartDate,
        emiDate: values.emiDate,
        vehicleDetails: values.vehicleDetails,
        propertyAddress: values.propertyAddress,
        purpose: values.purpose,
        notes: values.notes,
      };

      const { error } = await supabase
        .from('transactions')
        .update({
          category: values.category,
          amount: monthlyEMI,
          description: JSON.stringify(updatedDescription),
        })
        .eq('id', editEMI.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update EMI",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "EMI updated successfully",
        });
        if (onDataChanged) onDataChanged();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating EMI:', error);
      toast({
        title: "Error",
        description: "Failed to update EMI",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit EMI</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home Loan</SelectItem>
                        <SelectItem value="car">Car Loan</SelectItem>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="Marriage Loan">Marriage Loan</SelectItem>
                        <SelectItem value="Eureka forbes">Eureka Forbes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lenderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lender Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., HDFC Bank" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder="0.0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenureMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenure (Months)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emiStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EMI Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emiDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EMI Date (Day of Month)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" max="31" placeholder="5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Additional notes..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating...' : 'Update EMI'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

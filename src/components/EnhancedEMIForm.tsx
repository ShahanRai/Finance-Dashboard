import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface EnhancedEMIFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataChanged?: () => void;
}

interface EMIFormData {
  category: 'home_loan' | 'car_loan' | 'personal_loan' | 'education_loan';
  lenderName: string;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiStartDate: string;
  emiDate: number;
  vehicleDetails?: string;
  propertyAddress?: string;
  purpose?: string;
  notes?: string;
}

export const EnhancedEMIForm: React.FC<EnhancedEMIFormProps> = ({ open, onOpenChange, onDataChanged }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState<string>('');
  
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<EMIFormData>();

  const loanAmount = watch('loanAmount');
  const interestRate = watch('interestRate');
  const tenureMonths = watch('tenureMonths');

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    if (!principal || !tenure) return 0;
    if (!rate || rate === 0) {
      // 0% interest: simple division
      return Math.round(principal / tenure);
    }
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI(loanAmount, interestRate, tenureMonths);

  const onSubmit = async (data: EMIFormData) => {
    try {
      if (monthlyEMI === null || monthlyEMI === undefined || isNaN(monthlyEMI)) {
        toast({
          title: "Error",
          description: "Calculated EMI is invalid. Please check your inputs.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'emi',
          title: `${data.lenderName} - ${(data.category || '').replace('_', ' ').toUpperCase()}`,
          amount: monthlyEMI,
          category: data.category,
          description: JSON.stringify({
            lenderName: data.lenderName,
            loanAmount: data.loanAmount,
            interestRate: data.interestRate,
            tenureMonths: data.tenureMonths,
            emiStartDate: data.emiStartDate,
            emiDate: data.emiDate,
            vehicleDetails: data.vehicleDetails,
            propertyAddress: data.propertyAddress,
            purpose: data.purpose,
            notes: data.notes
          }),
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "EMI Added Successfully",
        description: `Monthly EMI of ₹${monthlyEMI.toLocaleString()} has been added.`,
      });
      if (onDataChanged) onDataChanged();
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding EMI:', error);
      toast({
        title: "Error",
        description: "Failed to add EMI. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'home_loan':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Textarea
                id="propertyAddress"
                {...register('propertyAddress')}
                placeholder="Enter property address"
              />
            </div>
          </div>
        );
      
      case 'car_loan':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicleDetails">Vehicle Details</Label>
              <Input
                id="vehicleDetails"
                {...register('vehicleDetails')}
                placeholder="Make, Model, Year (e.g., Honda City 2023)"
              />
            </div>
          </div>
        );
      
      case 'personal_loan':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Select onValueChange={(value) => setValue('purpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'education_loan':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Course/Institution Details</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Enter course and institution details"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New EMI</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-base font-medium">EMI Category</Label>
              <Input
                id="category"
                className="text-base"
                {...register('category', { required: 'Category is required' })}
                placeholder="Enter EMI category (e.g., Personal Loan, Home Loan, etc.)"
                value={category}
                onChange={e => { setCategory(e.target.value); setValue('category', e.target.value as any); }}
              />
              {typeof errors.category?.message === 'string' && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lenderName" className="text-base font-medium">Lender Name</Label>
              <Input
                id="lenderName"
                className="text-base"
                {...register('lenderName', { required: 'Lender name is required' })}
                placeholder="Enter lender name"
              />
              {typeof errors.lenderName?.message === 'string' && (
                <p className="text-sm text-red-500">{errors.lenderName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
              <Input
                id="loanAmount"
                type="number"
                {...register('loanAmount', { required: 'Loan amount is required', min: 1 })}
                placeholder="Enter loan amount"
              />
              {typeof errors.loanAmount?.message === 'string' && (
                <p className="text-sm text-red-500">{errors.loanAmount.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                {...register('interestRate', { required: 'Interest rate is required', min: 0 })}
                placeholder="Enter interest rate"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenureMonths">Tenure (Months)</Label>
              <Input
                id="tenureMonths"
                type="number"
                {...register('tenureMonths', { required: 'Tenure is required', min: 1 })}
                placeholder="Enter tenure in months"
              />
            </div>
            
            <div>
              <Label htmlFor="emiDate">EMI Date (Day of Month)</Label>
              <Input
                id="emiDate"
                type="number"
                min="1"
                max="31"
                {...register('emiDate', { required: 'EMI date is required', min: 1, max: 31 })}
                placeholder="Enter EMI date (1-31)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="emiStartDate">EMI Start Date</Label>
            <Input
              id="emiStartDate"
              type="date"
              {...register('emiStartDate', { required: 'Start date is required' })}
            />
          </div>

          {renderCategorySpecificFields()}

          {monthlyEMI >= 0 && !isNaN(monthlyEMI) && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold text-blue-900">
                Monthly EMI: ₹{monthlyEMI.toLocaleString()}
              </p>
              <p className="text-sm text-blue-700">
                Total Amount: ₹{(monthlyEMI * tenureMonths).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add EMI</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

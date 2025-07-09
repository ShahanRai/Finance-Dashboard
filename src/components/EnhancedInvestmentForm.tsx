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

interface EnhancedInvestmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataChanged?: () => void;
}

interface InvestmentFormData {
  category: 'stocks' | 'mutual_funds' | 'fixed_deposits' | 'bonds' | 'crypto' | 'ppf' | 'nps';
  name: string;
  amount: number;
  purchaseDate: string;
  quantity?: number;
  purchasePrice?: number;
  interestRate?: number;
  maturityDate?: string;
  bankName?: string;
  brokerageFees?: number;
  notes?: string;
  pranNumber?: string;
  fundManager?: string;
  contributionType?: string;
}

export const EnhancedInvestmentForm: React.FC<EnhancedInvestmentFormProps> = ({ open, onOpenChange, onDataChanged }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState<string>('');
  
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<InvestmentFormData>();

  const amount = watch('amount');
  const interestRate = watch('interestRate');
  const maturityDate = watch('maturityDate');
  const purchaseDate = watch('purchaseDate');

  const calculateMaturityAmount = () => {
    if (!amount || !interestRate || !purchaseDate || !maturityDate) return 0;
    
    const startDate = new Date(purchaseDate);
    const endDate = new Date(maturityDate);
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    return Math.round(amount * Math.pow(1 + interestRate / 100, years));
  };

  const maturityAmount = calculateMaturityAmount();

  const onSubmit = async (data: InvestmentFormData) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'investment',
          title: data.name,
          amount: data.amount,
          category: data.category,
          description: JSON.stringify({
            category: data.category,
            purchaseDate: data.purchaseDate,
            quantity: data.quantity,
            purchasePrice: data.purchasePrice,
            interestRate: data.interestRate,
            maturityDate: data.maturityDate,
            bankName: data.bankName,
            brokerageFees: data.brokerageFees,
            notes: data.notes,
            maturityAmount: maturityAmount
          }),
          date: data.purchaseDate
        });

      if (error) throw error;

      toast({
        title: "Investment Added Successfully",
        description: `Investment of ₹${data.amount.toLocaleString()} has been added.`,
      });
      if (onDataChanged) onDataChanged();
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding investment:', error);
      toast({
        title: "Error",
        description: "Failed to add investment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'stocks':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Number of Shares</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity')}
                  placeholder="Enter number of shares"
                />
              </div>
              <div>
                <Label htmlFor="purchasePrice">Purchase Price per Share (₹)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  {...register('purchasePrice')}
                  placeholder="Price per share"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="brokerageFees">Brokerage Fees (₹)</Label>
              <Input
                id="brokerageFees"
                type="number"
                step="0.01"
                {...register('brokerageFees')}
                placeholder="Enter brokerage fees (optional)"
              />
            </div>
          </div>
        );
      
      case 'mutual_funds':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="purchasePrice">NAV at Purchase (₹)</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                {...register('purchasePrice')}
                placeholder="NAV at time of purchase"
              />
            </div>
          </div>
        );
      
      case 'fixed_deposits':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Select onValueChange={(value) => setValue('bankName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">State Bank of India</SelectItem>
                  <SelectItem value="hdfc">HDFC Bank</SelectItem>
                  <SelectItem value="icici">ICICI Bank</SelectItem>
                  <SelectItem value="axis">Axis Bank</SelectItem>
                  <SelectItem value="pnb">Punjab National Bank</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  {...register('interestRate')}
                  placeholder="Annual interest rate"
                />
              </div>
              <div>
                <Label htmlFor="maturityDate">Maturity Date</Label>
                <Input
                  id="maturityDate"
                  type="date"
                  {...register('maturityDate')}
                />
              </div>
            </div>
            {maturityAmount > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Estimated Maturity Amount: ₹{maturityAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        );
      
      case 'ppf':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank/Post Office</Label>
              <Select onValueChange={(value) => setValue('bankName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank/post office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">State Bank of India</SelectItem>
                  <SelectItem value="hdfc">HDFC Bank</SelectItem>
                  <SelectItem value="icici">ICICI Bank</SelectItem>
                  <SelectItem value="axis">Axis Bank</SelectItem>
                  <SelectItem value="pnb">Punjab National Bank</SelectItem>
                  <SelectItem value="post_office">Post Office</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  {...register('interestRate')}
                  placeholder="Current PPF rate (7.1%)"
                  defaultValue="7.1"
                />
              </div>
              <div>
                <Label htmlFor="maturityDate">Maturity Date</Label>
                <Input
                  id="maturityDate"
                  type="date"
                  {...register('maturityDate')}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">PPF Account Number</Label>
              <Input
                id="notes"
                {...register('notes')}
                placeholder="Enter PPF account number"
              />
            </div>
          </div>
        );
      
      case 'nps':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pranNumber">PRAN Number</Label>
              <Input
                id="pranNumber"
                {...register('pranNumber')}
                placeholder="Enter PRAN (Permanent Retirement Account Number)"
              />
            </div>
            <div>
              <Label htmlFor="fundManager">Fund Manager</Label>
              <Select onValueChange={(value) => setValue('fundManager', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fund manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">SBI Pension Funds</SelectItem>
                  <SelectItem value="lic">LIC Pension Fund</SelectItem>
                  <SelectItem value="uti">UTI Retirement Solutions</SelectItem>
                  <SelectItem value="hdfc">HDFC Pension Management</SelectItem>
                  <SelectItem value="icici">ICICI Prudential Pension</SelectItem>
                  <SelectItem value="kotak">Kotak Mahindra Pension</SelectItem>
                  <SelectItem value="aditya_birla">Aditya Birla Sun Life</SelectItem>
                  <SelectItem value="tata">Tata Pension Management</SelectItem>
                  <SelectItem value="axis">Axis Pension Fund</SelectItem>
                  <SelectItem value="max">Max Life Pension</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contributionType">Contribution Type</Label>
              <Select onValueChange={(value) => setValue('contributionType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contribution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier1">Tier I (Mandatory)</SelectItem>
                  <SelectItem value="tier2">Tier II (Voluntary)</SelectItem>
                  <SelectItem value="both">Both Tier I & II</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes about NPS investment"
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
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Investment Category</Label>
              <Select 
                onValueChange={(value) => {
                  setCategory(value);
                  setValue('category', value as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select investment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                  <SelectItem value="fixed_deposits">Fixed Deposits</SelectItem>
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="ppf">Public Provident Fund (PPF)</SelectItem>
                  <SelectItem value="nps">National Pension System (NPS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="name">Investment Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Investment name is required' })}
                placeholder="Enter investment name/symbol"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Investment Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { required: 'Investment amount is required', min: 1 })}
                placeholder="Enter investment amount"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate', { required: 'Purchase date is required' })}
              />
            </div>
          </div>

          {renderCategorySpecificFields()}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Investment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

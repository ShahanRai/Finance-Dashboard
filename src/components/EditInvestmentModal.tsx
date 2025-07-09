import React, { useEffect, useState } from 'react';
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

interface EditInvestmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editInvestment: any;
  onDataChanged?: () => void;
}

export const EditInvestmentModal: React.FC<EditInvestmentModalProps> = ({ open, onOpenChange, editInvestment, onDataChanged }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState<string>('');
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<any>();

  useEffect(() => {
    if (editInvestment) {
      let details = {};
      try {
        details = JSON.parse(editInvestment.description || '{}');
      } catch {}
      setCategory(editInvestment.category || '');
      reset({
        category: editInvestment.category,
        name: editInvestment.title || '',
        amount: editInvestment.amount || '',
        purchaseDate: details['purchaseDate'] || '',
        quantity: details['quantity'] || '',
        purchasePrice: details['purchasePrice'] || '',
        interestRate: details['interestRate'] || '',
        maturityDate: details['maturityDate'] || '',
        bankName: details['bankName'] || '',
        brokerageFees: details['brokerageFees'] || '',
        notes: details['notes'] || '',
        pranNumber: details['pranNumber'] || '',
        fundManager: details['fundManager'] || '',
        contributionType: details['contributionType'] || '',
      });
    }
  }, [editInvestment, reset]);

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
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
            pranNumber: data.pranNumber,
            fundManager: data.fundManager,
            contributionType: data.contributionType
          }),
          date: data.purchaseDate
        })
        .eq('id', editInvestment.id);
      if (error) throw error;
      toast({ title: 'Investment Updated', description: 'Investment updated successfully.' });
      if (onDataChanged) onDataChanged();
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update investment.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', editInvestment.id);
      if (error) throw error;
      toast({ title: 'Investment Deleted', description: 'Investment deleted successfully.' });
      if (onDataChanged) onDataChanged();
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete investment.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setValue('category', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                  <SelectItem value="fixed_deposits">Fixed Deposits</SelectItem>
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="ppf">PPF</SelectItem>
                  <SelectItem value="nps">NPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name', { required: true })} placeholder="Investment name" />
              {errors.name && <span className="text-xs text-red-500">Name is required</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount Invested (₹)</Label>
              <Input id="amount" type="number" step="0.01" {...register('amount', { required: true })} placeholder="Amount" />
              {errors.amount && <span className="text-xs text-red-500">Amount is required</span>}
            </div>
            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" type="date" {...register('purchaseDate', { required: true })} />
              {errors.purchaseDate && <span className="text-xs text-red-500">Purchase date is required</span>}
            </div>
          </div>
          {/* Category-specific fields */}
          {category === 'stocks' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Number of Shares</Label>
                  <Input id="quantity" type="number" {...register('quantity')} placeholder="Enter number of shares" />
                </div>
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price per Share (₹)</Label>
                  <Input id="purchasePrice" type="number" step="0.01" {...register('purchasePrice')} placeholder="Price per share" />
                </div>
              </div>
              <div>
                <Label htmlFor="brokerageFees">Brokerage Fees (₹)</Label>
                <Input id="brokerageFees" type="number" step="0.01" {...register('brokerageFees')} placeholder="Enter brokerage fees (optional)" />
              </div>
            </div>
          )}
          {category === 'mutual_funds' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="purchasePrice">NAV at Purchase (₹)</Label>
                <Input id="purchasePrice" type="number" step="0.01" {...register('purchasePrice')} placeholder="NAV at time of purchase" />
              </div>
            </div>
          )}
          {category === 'fixed_deposits' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Select
                  value={watch('bankName') || ''}
                  onValueChange={value => setValue('bankName', value)}
                >
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
                  <Input id="interestRate" type="number" step="0.01" {...register('interestRate')} placeholder="Annual interest rate" />
                </div>
                <div>
                  <Label htmlFor="maturityDate">Maturity Date</Label>
                  <Input id="maturityDate" type="date" {...register('maturityDate')} />
                </div>
              </div>
            </div>
          )}
          {category === 'ppf' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank/Post Office</Label>
                <Select
                  value={watch('bankName') || ''}
                  onValueChange={value => setValue('bankName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank/post office" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbi">State Bank of India</SelectItem>
                    <SelectItem value="post_office">Post Office</SelectItem>
                    <SelectItem value="hdfc">HDFC Bank</SelectItem>
                    <SelectItem value="icici">ICICI Bank</SelectItem>
                    <SelectItem value="axis">Axis Bank</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input id="interestRate" type="number" step="0.01" {...register('interestRate')} placeholder="Current PPF rate" />
                </div>
                <div>
                  <Label htmlFor="maturityDate">Maturity Date</Label>
                  <Input id="maturityDate" type="date" {...register('maturityDate')} />
                </div>
              </div>
              <div>
                <Label htmlFor="accountNumber">PPF Account Number</Label>
                <Input id="accountNumber" {...register('accountNumber')} placeholder="Enter PPF account number" />
              </div>
            </div>
          )}
          {category === 'nps' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="pranNumber">PRAN Number</Label>
                <Input id="pranNumber" {...register('pranNumber')} placeholder="Enter PRAN number" />
              </div>
              <div>
                <Label htmlFor="fundManager">Fund Manager</Label>
                <Select
                  value={watch('fundManager') || ''}
                  onValueChange={value => setValue('fundManager', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fund manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbi">SBI Pension Funds</SelectItem>
                    <SelectItem value="lic">LIC Pension Fund</SelectItem>
                    <SelectItem value="uti">UTI Retirement Solutions</SelectItem>
                    <SelectItem value="hdfc">HDFC Pension Management</SelectItem>
                    <SelectItem value="icici">ICICI Prudential Pension Fund</SelectItem>
                    <SelectItem value="kotak">Kotak Pension Fund</SelectItem>
                    <SelectItem value="aditya_birla">Aditya Birla Sun Life Pension</SelectItem>
                    <SelectItem value="tata">Tata Pension Management</SelectItem>
                    <SelectItem value="axis">Axis Pension Fund</SelectItem>
                    <SelectItem value="max_life">Max Life Pension Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contributionType">Contribution Type</Label>
                <Select
                  value={watch('contributionType') || ''}
                  onValueChange={value => setValue('contributionType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contribution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tier1">Tier I (Mandatory)</SelectItem>
                    <SelectItem value="tier2">Tier II (Voluntary)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Additional notes (optional)" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
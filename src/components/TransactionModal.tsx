
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown, PiggyBank, CreditCard } from 'lucide-react';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'income' | 'expense' | 'investment' | 'emi';
  onDataChanged?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ open, onOpenChange, type, onDataChanged }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const getTypeConfig = () => {
    const configs = {
      income: {
        title: 'Add Income',
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        color: 'text-green-600',
        categories: ['Salary', 'Freelance', 'Investment Returns', 'Business', 'Other']
      },
      expense: {
        title: 'Add Expense',
        icon: <TrendingDown className="h-5 w-5 text-red-600" />,
        color: 'text-red-600',
        categories: ['Food', 'Transportation', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Other'],
        paymentMethods: ['Cash', 'Credit Card', 'UPI']
      },
      investment: {
        title: 'Add Investment',
        icon: <PiggyBank className="h-5 w-5 text-blue-600" />,
        color: 'text-blue-600',
        categories: ['Stocks', 'Mutual Funds', 'Real Estate', 'Cryptocurrency', 'Fixed Deposits', 'Other']
      },
      emi: {
        title: 'Add EMI',
        icon: <CreditCard className="h-5 w-5 text-purple-600" />,
        color: 'text-purple-600',
        categories: ['Home Loan', 'Car Loan', 'Personal Loan', 'Credit Card', 'Other']
      }
    };
    return configs[type];
  };

  const config = getTypeConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const transactionData: any = {
        user_id: user.id,
        type,
        title,
        amount: parseFloat(amount),
        category: category || null,
        description: description || null,
        date,
      };

      // Add payment_method for expense transactions
      if (type === 'expense') {
        transactionData.payment_method = paymentMethod;
      }

      const { error } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (error) {
        console.error('Transaction insert error:', error);
        toast({
          title: "Error",
          description: `Failed to add ${type}: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `${config.title.replace('Add ', '')} added successfully`,
        });
        if (onDataChanged) onDataChanged();
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Cash');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${type} title`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {config.categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes..."
              rows={3}
            />
          </div>

          {type === 'expense' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

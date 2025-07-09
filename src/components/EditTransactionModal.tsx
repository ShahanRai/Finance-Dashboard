import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface EditTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: any;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ 
  open, 
  onOpenChange, 
  transaction 
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title || '');
      setAmount(transaction.amount?.toString() || '');
      setCategory(transaction.category || '');
      setDescription(transaction.description || '');
      setDate(transaction.date || new Date().toISOString().split('T')[0]);
    }
  }, [transaction, open]);

  const getTypeConfig = () => {
    const configs = {
      income: {
        title: 'Edit Income',
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        color: 'text-green-600',
        categories: ['Salary', 'Freelance', 'Investment Returns', 'Business', 'Other']
      },
      expense: {
        title: 'Edit Expense',
        icon: <TrendingDown className="h-5 w-5 text-red-600" />,
        color: 'text-red-600',
        categories: ['Food', 'Transportation', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Other']
      }
    };
    return configs[transaction?.type as keyof typeof configs] || configs.income;
  };

  const config = getTypeConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !transaction) return;
    setLoading(true);

    const { error } = await supabase
      .from('transactions')
      .update({
        title,
        amount: parseFloat(amount),
        category: category || null,
        description: description || null,
        date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      onOpenChange(false);
    }
    setLoading(false);
  };

  if (!transaction) return null;

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
              placeholder={`Enter ${transaction.type} title`}
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Transaction'}
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
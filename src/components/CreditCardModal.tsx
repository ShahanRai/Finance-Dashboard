import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, Trash2 } from 'lucide-react';

interface CreditCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCard?: any;
  onDataChanged?: () => void;
}

export const CreditCardModal: React.FC<CreditCardModalProps> = ({ open, onOpenChange, editCard, onDataChanged }) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('Visa');
  const [creditLimit, setCreditLimit] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [colorTheme, setColorTheme] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const cardColors = [
    { name: 'Blue', value: '#6366f1' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
  ];

  useEffect(() => {
    if (editCard) {
      setCardName(editCard.card_name);
      setCardNumber(editCard.card_number);
      setCardType(editCard.card_type);
      setCreditLimit(editCard.credit_limit.toString());
      setCurrentBalance(editCard.current_balance?.toString() || '0');
      setDueDate(editCard.due_date || '');
      setColorTheme(editCard.color_theme || '#6366f1');
    } else {
      resetForm();
    }
  }, [editCard, open]);

  const resetForm = () => {
    setCardName('');
    setCardNumber('');
    setCardType('Visa');
    setCreditLimit('');
    setCurrentBalance('0');
    setDueDate('');
    setColorTheme('#6366f1');
  };

  const formatCardNumber = (value: string) => {
    // Only store last 4 digits for security
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 4) {
      return '****' + cleaned.slice(-4);
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const cardData = {
      user_id: user.id,
      card_name: cardName,
      card_number: formatCardNumber(cardNumber),
      card_type: cardType,
      credit_limit: parseFloat(creditLimit),
      current_balance: parseFloat(currentBalance),
      due_date: dueDate || null,
      color_theme: colorTheme,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editCard) {
      const { error: updateError } = await supabase
        .from('credit_cards')
        .update(cardData)
        .eq('id', editCard.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('credit_cards')
        .insert(cardData);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error",
        description: `Failed to ${editCard ? 'update' : 'add'} credit card`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Credit card ${editCard ? 'updated' : 'added'} successfully`,
      });
      if (onDataChanged) onDataChanged();
      onOpenChange(false);
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!editCard || !user) return;
    setLoading(true);

    const { error } = await supabase
      .from('credit_cards')
      .delete()
      .eq('id', editCard.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete credit card",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Credit card deleted successfully",
      });
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {editCard ? 'Edit Credit Card' : 'Add Credit Card'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Name</label>
            <Input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="My Card"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number (Last 4 digits)</label>
            <Input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234"
              maxLength={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Card Type</label>
            <Select value={cardType} onValueChange={setCardType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="Mastercard">Mastercard</SelectItem>
                <SelectItem value="American Express">American Express</SelectItem>
                <SelectItem value="Discover">Discover</SelectItem>
                <SelectItem value="Rupay">Rupay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Credit Limit</label>
              <Input
                type="number"
                step="0.01"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                placeholder="10000"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Balance</label>
              <Input
                type="number"
                step="0.01"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date (Optional)</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Card Color</label>
            <div className="flex gap-2">
              {cardColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setColorTheme(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    colorTheme === color.value ? 'border-gray-900 scale-110' : 'border-gray-300'
                  } transition-all`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (editCard ? 'Updating...' : 'Adding...') : (editCard ? 'Update Card' : 'Add Card')}
            </Button>
            {editCard && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading}
                className="px-3"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

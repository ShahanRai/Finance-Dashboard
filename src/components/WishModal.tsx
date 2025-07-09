import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Target, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editWish?: any;
  onDataChanged?: () => void;
}

const wishCategories = [
  { label: 'Gadget', value: 'gadget' },
  { label: 'Travel', value: 'travel' },
  { label: 'Education', value: 'education' },
  { label: 'Vehicle', value: 'vehicle' },
  { label: 'Home', value: 'home' },
  { label: 'Gift', value: 'gift' },
  { label: 'Other', value: 'other' },
];

export const WishModal: React.FC<WishModalProps> = ({ open, onOpenChange, editWish, onDataChanged }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState('other');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(profileData);
  };

  const getCurrencySymbol = () => {
    return profile?.currency === 'INR' ? '₹' : '$';
  };

  useEffect(() => {
    if (editWish) {
      setTitle(editWish.title);
      setDescription(editWish.description || '');
      setTargetAmount(editWish.target_amount?.toString() || '');
      setCurrentAmount(editWish.current_amount?.toString() || '');
      setTargetDate(editWish.target_date || '');
      setCategory(editWish.category || 'other');
    } else {
      resetForm();
    }
  }, [editWish, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setCurrentAmount('0');
    setTargetDate('');
    setCategory('other');
  };

  const handleSave = async () => {
    if (!user || !title || !targetAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const wishData = {
      user_id: user.id,
      title,
      description,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount) || 0,
      target_date: targetDate || null,
      category,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editWish) {
      const { error: updateError } = await (supabase as any)
        .from('wishes')
        .update(wishData)
        .eq('id', editWish.id);
      error = updateError;
    } else {
      const { error: insertError } = await (supabase as any)
        .from('wishes')
        .insert([wishData]);
      error = insertError;
    }

    if (error) {
      console.error('Wish operation error:', error);
      toast({
        title: "Error",
        description: `Failed to ${editWish ? 'update' : 'create'} wish`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Wish ${editWish ? 'updated' : 'created'} successfully`,
      });
      if (onDataChanged) onDataChanged();
      onOpenChange(false);
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!editWish) return;
    try {
      const { error } = await supabase.from('wishes').delete().eq('id', editWish.id);
      if (error) throw error;
      if (onDataChanged) onDataChanged();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting wish:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              {editWish ? 'Edit Wish' : 'Create New Wish'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="text-sm font-medium">Wish Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., iPhone 15 Pro"
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why do you want this?"
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {wishCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-gray-400">
                    {getCurrencySymbol()}
                  </span>
                  <Input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="1000"
                    className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-gray-400">
                    {getCurrencySymbol()}
                  </span>
                  <Input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0"
                    className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-medium">Target Date</label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </motion.div>

            <div className="flex justify-end gap-2 pt-4">
              {editWish && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSave}>
                  {editWish ? 'Save Changes' : 'Add Wish'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

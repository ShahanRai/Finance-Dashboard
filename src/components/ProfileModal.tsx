import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Settings, LogOut, Moon, Sun, Trash2 } from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataCleared?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ open, onOpenChange, onDataCleared }) => {
  const [username, setUsername] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');
  const [loading, setLoading] = useState(false);
  const [clearDataModalOpen, setClearDataModalOpen] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState({
    transactions: false,
    creditCards: false,
    wishes: false,
    profile: false
  });
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    if (user && open) {
      fetchProfile();
    }
  }, [user, open]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setUsername(data.username);
      setCurrency(data.currency);
    } else if (error) {
      console.log('Profile not found, will create on save');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        currency,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onOpenChange(false);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
  };

  const handleClearData = () => {
    setClearDataModalOpen(true);
  };

  const handleConfirmClearData = async () => {
    if (!user) return;
    
    const selectedTypes = Object.entries(selectedDataTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type, _]) => type);

    if (selectedTypes.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one data type to clear.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`Are you sure you want to clear the selected data? This action cannot be undone.`)) return;
    
    setClearLoading(true);
    try {
      // Delete selected data types
      if (selectedDataTypes.transactions) {
        await supabase.from('transactions').delete().eq('user_id', user.id);
      }
      if (selectedDataTypes.creditCards) {
        await supabase.from('credit_cards').delete().eq('user_id', user.id);
      }
      if (selectedDataTypes.wishes) {
        await supabase.from('wishes').delete().eq('user_id', user.id);
      }
      if (selectedDataTypes.profile) {
        await supabase.from('profiles').delete().eq('id', user.id);
      }

      toast({
        title: 'Success',
        description: 'Selected data has been cleared successfully.',
      });
      setClearDataModalOpen(false);
      setSelectedDataTypes({
        transactions: false,
        creditCards: false,
        wishes: false,
        profile: false
      });
      if (onDataCleared) {
        onDataCleared();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear data. Please try again.',
        variant: 'destructive',
      });
    }
    setClearLoading(false);
  };

  const getCurrencySymbol = (curr: string) => {
    return curr === 'INR' ? '₹' : '$';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
            <User className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Email</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <Select value={currency} onValueChange={(value: 'INR' | 'USD') => setCurrency(value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Selected symbol: <span className="font-bold">{getCurrencySymbol(currency)}</span>
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={loading} 
              className="flex-1 transition-all duration-200 hover:scale-105"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearData}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Data
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Clear Data Modal */}
      <Dialog open={clearDataModalOpen} onOpenChange={setClearDataModalOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Clear Data
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select the data you want to clear. This action cannot be undone.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  id="selectAll"
                  checked={Object.values(selectedDataTypes).every(Boolean)}
                  onCheckedChange={(checked) => {
                    const newState = {
                      transactions: checked as boolean,
                      creditCards: checked as boolean,
                      wishes: checked as boolean,
                      profile: checked as boolean
                    };
                    setSelectedDataTypes(newState);
                  }}
                />
                <label htmlFor="selectAll" className="text-sm font-semibold">
                  Select All
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transactions"
                  checked={selectedDataTypes.transactions}
                  onCheckedChange={(checked) => 
                    setSelectedDataTypes(prev => ({ ...prev, transactions: checked as boolean }))
                  }
                />
                <label htmlFor="transactions" className="text-sm font-medium">
                  All Transactions (Income, Expenses, Investments, EMIs)
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="creditCards"
                  checked={selectedDataTypes.creditCards}
                  onCheckedChange={(checked) => 
                    setSelectedDataTypes(prev => ({ ...prev, creditCards: checked as boolean }))
                  }
                />
                <label htmlFor="creditCards" className="text-sm font-medium">
                  Credit Cards
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wishes"
                  checked={selectedDataTypes.wishes}
                  onCheckedChange={(checked) => 
                    setSelectedDataTypes(prev => ({ ...prev, wishes: checked as boolean }))
                  }
                />
                <label htmlFor="wishes" className="text-sm font-medium">
                  Wish List
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile"
                  checked={selectedDataTypes.profile}
                  onCheckedChange={(checked) => 
                    setSelectedDataTypes(prev => ({ ...prev, profile: checked as boolean }))
                  }
                />
                <label htmlFor="profile" className="text-sm font-medium">
                  Profile Settings
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="destructive"
                onClick={handleConfirmClearData}
                disabled={clearLoading}
                className="flex-1"
              >
                {clearLoading ? 'Clearing...' : 'Clear Selected Data'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setClearDataModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

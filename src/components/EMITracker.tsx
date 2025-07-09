import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Home, Car, CreditCard, Plus } from 'lucide-react';

interface EMIItem {
  id: string;
  name: string;
  type: 'home' | 'car' | 'personal' | 'credit';
  monthlyAmount: number;
  totalAmount: number;
  remainingMonths: number;
  totalMonths: number;
}

interface EMITrackerProps {
  emis: EMIItem[];
  getCurrencySymbol: () => string;
  onAddEMI: () => void;
  onEditEMI?: (emi: any) => void;
}

export const EMITracker: React.FC<EMITrackerProps> = ({
  emis,
  getCurrencySymbol,
  onAddEMI,
  onEditEMI
}) => {
  const getEMIIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-6 w-6 text-blue-600" />;
      case 'car': return <Car className="h-6 w-6 text-green-600" />;
      case 'credit': return <CreditCard className="h-6 w-6 text-purple-600" />;
      default: return <CreditCard className="h-6 w-6 text-orange-600" />;
    }
  };

  const getProgressPercentage = (remaining: number, total: number) => {
    return ((total - remaining) / total) * 100;
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Home Loan';
      case 'car': return 'Car Loan';
      case 'personal': return 'Personal Loan';
      case 'credit': return 'Credit Card';
      default: return type;
    }
  };

  if (emis.length === 0) {
    return (
      <div className="text-center py-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center"
        >
          <CreditCard className="h-8 w-8 text-white" />
        </motion.div>
        <p className="text-gray-500 dark:text-gray-400 mb-4 text-base">No EMIs tracked yet</p>
        <Button
          onClick={onAddEMI}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add EMI
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {emis.map((emi, index) => {
        const paid = (emi.totalMonths - emi.remainingMonths) * emi.monthlyAmount;
        const pending = emi.totalAmount - paid;
        const progress = getProgressPercentage(emi.remainingMonths, emi.totalMonths);

        return (
          <motion.div
            key={emi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-5 rounded-2xl border bg-white dark:bg-[#111111] dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => onEditEMI && onEditEMI(emi)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4 items-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                  {getEMIIcon(emi.type)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getCategoryLabel(emi.type)}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getCurrencySymbol()}{emi.monthlyAmount.toLocaleString()}/Month · {emi.remainingMonths} EMI left
                  </p>
                </div>
              </div>
              <div className="text-sm text-right text-gray-400 dark:text-gray-500 font-medium">
                Total:<br />{getCurrencySymbol()}{emi.totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="mt-3">
              <div className="relative h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-3 mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                <div>
                  <span className="block text-gray-700 dark:text-gray-300">Paid</span>
                  {getCurrencySymbol()}{paid.toLocaleString()}
                </div>
                <div className="text-center">
                  <span className="block text-gray-700 dark:text-gray-300">Pending</span>
                  {getCurrencySymbol()}{pending.toLocaleString()}
                </div>
                <div className="text-right">
                  <span className="block text-gray-700 dark:text-gray-300">Progress</span>
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      <Button onClick={onAddEMI} variant="outline" className="w-full mt-2 text-sm font-medium">
        <Plus className="h-4 w-4 mr-2" />
        Add New EMI
      </Button>
    </div>
  );
};

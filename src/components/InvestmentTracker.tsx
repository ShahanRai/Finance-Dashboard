import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, PiggyBank, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'mutual_funds' | 'crypto' | 'bonds';
  amount: number;
  currentValue: number;
  change: number;
  changePercentage: number;
}

interface InvestmentTrackerProps {
  investments: Investment[];
  getCurrencySymbol: () => string;
  onAddInvestment: () => void;
  onEditInvestment?: (investment: any) => void;
}

export const InvestmentTracker: React.FC<InvestmentTrackerProps> = ({ 
  investments, 
  getCurrencySymbol, 
  onAddInvestment, 
  onEditInvestment
}) => {
  const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalGainLoss = totalPortfolioValue - totalInvestment;
  const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  // Progress percentage for each investment
  const getProgressPercentage = (currentValue: number, amount: number) => {
    if (!amount) return 0;
    return Math.min(100, (currentValue / amount) * 100);
  };

  if (investments.length === 0) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center"
        >
          <PiggyBank className="h-8 w-8 text-white" />
        </motion.div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">No investments yet</p>
        <Button onClick={onAddInvestment} className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Start Investing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600"
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {getCurrencySymbol()}{totalPortfolioValue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Portfolio Value</p>
          <div className={`flex items-center justify-center gap-1 text-sm ${
            totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalGainLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>
              {totalGainLoss >= 0 ? '+' : ''}{getCurrencySymbol()}{Math.abs(totalGainLoss).toLocaleString()} 
              ({totalGainLossPercentage >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Individual Investments */}
      <div className="space-y-2">
        {investments.map((investment, index) => (
          <motion.div
            key={investment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onEditInvestment && onEditInvestment(investment)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <PiggyBank className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{investment.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {investment.type.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getCurrencySymbol()}{investment.currentValue.toLocaleString()}
              </span>
              <p className={`text-xs flex items-center gap-1 ${
                investment.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {investment.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {investment.changePercentage >= 0 ? '+' : ''}{investment.changePercentage.toFixed(2)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Button onClick={onAddInvestment} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Investment
      </Button>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, CreditCard, Plus } from 'lucide-react';

interface OverviewCardsProps {
  totals: {
    balance: number;
    income: number;
    expenses: number;
  };
  previousTotals: {
    balance: number;
    income: number;
    expenses: number;
  };
  creditCards: any[];
  getCurrencySymbol: () => string;
  onOpenTransactionModal: (type: 'income' | 'expense' | 'investment' | 'emi') => void;
  onOpenCreditCardModal: () => void;
  calculatePercentageChange: (current: number, previous: number) => string;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  totals,
  previousTotals,
  creditCards,
  getCurrencySymbol,
  onOpenTransactionModal,
  onOpenCreditCardModal,
  calculatePercentageChange
}) => {
  const totalCreditLimit = creditCards.reduce((sum, card) => sum + Number(card.credit_limit), 0);
  const totalCreditUsed = creditCards.reduce((sum, card) => sum + Number(card.current_balance), 0);
  const creditUsagePercentage = totalCreditLimit > 0 ? Math.round((totalCreditUsed / totalCreditLimit) * 100) : 0;

  const cards = [
    { 
      title: 'Total Balance', 
      value: totals.balance, 
      icon: TrendingUp, 
      change: calculatePercentageChange(totals.balance, previousTotals.balance),
      color: totals.balance >= previousTotals.balance ? 'text-green-500' : 'text-red-500',
      onClick: null, // No click action for total balance
      showButton: false // Don't show + button for total balance
    },
    { 
      title: 'Monthly Income', 
      value: totals.income, 
      icon: TrendingUp, 
      change: calculatePercentageChange(totals.income, previousTotals.income),
      color: totals.income >= previousTotals.income ? 'text-green-500' : 'text-red-500',
      onClick: () => onOpenTransactionModal('income'),
      showButton: true
    },
    { 
      title: 'Monthly Expenses', 
      value: totals.expenses, 
      icon: TrendingDown, 
      change: calculatePercentageChange(totals.expenses, previousTotals.expenses),
      color: totals.expenses <= previousTotals.expenses ? 'text-green-500' : 'text-red-500',
      onClick: () => onOpenTransactionModal('expense'),
      showButton: true
    },
    { 
      title: 'Credit Used', 
      value: totalCreditUsed, 
      icon: CreditCard, 
      change: `${creditUsagePercentage}% of limit`, 
      color: creditUsagePercentage < 50 ? 'text-green-500' : creditUsagePercentage < 80 ? 'text-yellow-500' : 'text-red-500',
      onClick: onOpenCreditCardModal,
      showButton: false // Don't show + button for Credit Used
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={card.onClick}
          className={card.onClick ? "cursor-pointer" : ""}
        >
          <Card className="hover-lift bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className={`flex items-center gap-2 text-sm ${card.color} mb-1`}>
                    <card.icon className="h-4 w-4" />
                    <span>{card.change}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getCurrencySymbol()}{Math.abs(card.value).toLocaleString()}
                  </p>
                </div>
                {card.showButton && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ShoppingBag, Car, Gamepad2, Lightbulb, Edit, Trash2 } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: any[];
  getCurrencySymbol: () => string;
  onEditTransaction?: (transaction: any) => void;
  onDeleteTransaction?: (transactionId: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  getCurrencySymbol,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const getTransactionIcon = (type: string, category?: string) => {
    if (type === 'income') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (type === 'expense') {
      switch (category?.toLowerCase()) {
        case 'food': return <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center"><ShoppingBag className="h-4 w-4 text-red-600" /></div>;
        case 'transport': return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center"><Car className="h-4 w-4 text-green-600" /></div>;
        case 'shopping': return <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center"><ShoppingBag className="h-4 w-4 text-orange-600" /></div>;
        case 'entertainment': return <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center"><Gamepad2 className="h-4 w-4 text-pink-600" /></div>;
        case 'bills': return <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center"><Lightbulb className="h-4 w-4 text-red-600" /></div>;
        default: return <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center"><ArrowDown className="h-4 w-4 text-red-600" /></div>;
      }
    }
    return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"><ArrowUp className="h-4 w-4 text-blue-600" /></div>;
  };

  const handleEdit = (transaction: any) => {
    if (onEditTransaction) {
      onEditTransaction(transaction);
    }
  };

  const handleDelete = (transactionId: string) => {
    if (onDeleteTransaction) {
      onDeleteTransaction(transactionId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="hover-lift bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction, index) => {
              const canEdit = transaction.type === 'income' || transaction.type === 'expense';
              return (
                <motion.div
                  key={transaction.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type, transaction.category)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date || '').toLocaleDateString()} • {transaction.category || transaction.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-[140px] justify-end">
                    <motion.span
                      className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} block`}
                      animate={hoveredIndex === index && canEdit ? { x: -56 } : { x: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{getCurrencySymbol()}{Number(transaction.amount).toLocaleString()}
                    </motion.span>
                    {/* Edit and Delete Icons - Only show for income and expense transactions */}
                    <motion.div
                      className="flex items-center gap-1 w-14" // reserve space for 2 icons
                      animate={hoveredIndex === index && canEdit ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      {canEdit && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

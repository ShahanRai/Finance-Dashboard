import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Target, Plus, Smartphone, Plane, GraduationCap, Car, Home, Gift
} from 'lucide-react';

interface WishesSectionProps {
  wishes: any[];
  getCurrencySymbol: () => string;
  onOpenWishModal: (wish?: any) => void;
}

export const WishesSection: React.FC<WishesSectionProps> = ({
  wishes,
  getCurrencySymbol,
  onOpenWishModal
}) => {
  const getWishIcon = (category: string) => {
    switch (category) {
      case 'gadget': return <Smartphone className="h-6 w-6 text-blue-500" />;
      case 'travel': return <Plane className="h-6 w-6 text-pink-500" />;
      case 'education': return <GraduationCap className="h-6 w-6 text-green-600" />;
      case 'vehicle': return <Car className="h-6 w-6 text-orange-500" />;
      case 'home': return <Home className="h-6 w-6 text-purple-600" />;
      case 'gift': return <Gift className="h-6 w-6 text-yellow-500" />;
      default: return <Target className="h-6 w-6 text-gray-400" />;
    }
  };

  const getProgress = (wish: any) => {
    const current = Number(wish.current_amount);
    const target = Number(wish.target_amount);
    return Math.min((current / target) * 100, 100);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <Card className="bg-white dark:bg-[#111111] border-0 shadow-md rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-600" />
            My Wishes
          </CardTitle>
          <Button onClick={() => onOpenWishModal()} variant="ghost" size="sm">
            <Plus className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent>
          {wishes.length === 0 ? (
            <div className="text-center py-6">
              <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No wishes yet</p>
              <Button onClick={() => onOpenWishModal()} size="sm">
                Add Your First Wish
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {wishes.slice(0, 3).map((wish, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5 backdrop-blur hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => onOpenWishModal(wish)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {getWishIcon(wish.category)}
                      <h4 className="font-medium text-base text-gray-900 dark:text-white">
                        {wish.title}
                      </h4>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                      {Math.round(getProgress(wish))}%
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>
                        {getCurrencySymbol()}
                        {Number(wish.current_amount).toLocaleString()}
                      </span>
                      <span>
                        {getCurrencySymbol()}
                        {Number(wish.target_amount).toLocaleString()}
                      </span>
                    </div>

                    <Progress
                      value={getProgress(wish)}
                      className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500 transition-all duration-300"
                    />

                    {wish.target_date && (
                      <p className="text-xs mt-2 text-right text-gray-500 dark:text-gray-400 italic">
                        🎯 Target: {new Date(wish.target_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

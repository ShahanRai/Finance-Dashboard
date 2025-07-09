import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MonthSelector } from './MonthSelector';
import { Bell, User, Eye, EyeOff, Moon, Sun } from 'lucide-react';

interface DashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  theme: string;
  toggleTheme: () => void;
  showFakeData: boolean;
  setShowFakeData: (show: boolean) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  onOpenProfile: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedMonth,
  onMonthChange,
  theme,
  toggleTheme,
  showFakeData,
  setShowFakeData,
  notificationsEnabled,
  toggleNotifications,
  onOpenProfile
}) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center max-w-7xl mx-auto">
        <div className="order-1 sm:order-none">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, manage your finances effectively</p>
        </div>
        <div className="flex flex-col gap-2 order-2 sm:order-none sm:flex-row sm:items-center sm:gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <MonthSelector selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover-lift"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setShowFakeData(!showFakeData)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover-lift"
            >
              {showFakeData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={toggleNotifications}
              variant="outline" 
              size="sm" 
              className={`hover-lift ${notificationsEnabled ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              onClick={onOpenProfile}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover-lift"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

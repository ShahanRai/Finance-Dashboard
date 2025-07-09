import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from './DashboardHeader';
import { OverviewCards } from './OverviewCards';
import { RecentTransactions } from './RecentTransactions';
import { WishesSection } from './WishesSection';
import { DashboardModals } from './DashboardModals';
import { CreditCardStack } from './CreditCardStack';
import { AnimatedPieChart } from './AnimatedPieChart';
import { AnimatedLineChart } from './AnimatedLineChart';
import { EMITracker } from './EMITracker';
import { InvestmentTracker } from './InvestmentTracker';
import { EnhancedEMIForm } from './EnhancedEMIForm';
import { EnhancedInvestmentForm } from './EnhancedInvestmentForm';
import { EditTransactionModal } from './EditTransactionModal';
import { fakeDataService } from '@/services/fakeDataService';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  PiggyBank, CreditCard, Plus
} from 'lucide-react';
import { EditEMIModal } from './EditEMIModal';
import { EditInvestmentModal } from './EditInvestmentModal';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
  const [emis, setEmis] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [showFakeData, setShowFakeData] = useState(false);
  
  // Set default to current month/year
  const currentDate = new Date();
  const currentMonthYear = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [previousTotals, setPreviousTotals] = useState({ balance: 0, income: 0, expenses: 0 });
  
  // Modal states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [creditCardModalOpen, setCreditCardModalOpen] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [enhancedEMIModalOpen, setEnhancedEMIModalOpen] = useState(false);
  const [enhancedInvestmentModalOpen, setEnhancedInvestmentModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'investment' | 'emi'>('income');
  const [editingCard, setEditingCard] = useState<any>(null);
  const [editingWish, setEditingWish] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editTransactionModalOpen, setEditTransactionModalOpen] = useState(false);
  const [editingEMI, setEditingEMI] = useState<any>(null);
  const [editEMIModalOpen, setEditEMIModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<any>(null);
  const [editInvestmentModalOpen, setEditInvestmentModalOpen] = useState(false);

  // Helper function to get the correct number of days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Helper function to get proper date range for a given month
  const getMonthDateRange = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const startDate = `${yearMonth}-01`;
    const daysInMonth = getDaysInMonth(year, month);
    const endDate = `${yearMonth}-${daysInMonth.toString().padStart(2, '0')}`;
    return { startDate, endDate };
  };

  useEffect(() => {
    if (user) {
      fetchData();
      setupRealtimeSubscriptions();
    }
  }, [user, selectedMonth]);

  const fetchData = async () => {
    if (!user) return;

    try {
      console.log('Fetching data for month:', selectedMonth);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Fetch credit cards
      const { data: cardsData } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setCreditCards(cardsData || []);

      // Fix date range calculation to prevent invalid dates
      const { startDate, endDate } = getMonthDateRange(selectedMonth);
      
      console.log('Date range:', startDate, 'to', endDate);

      // Fetch transactions for selected month
      const { data: transactionsData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (transactionError) {
        console.error('Transaction fetch error:', transactionError.message, transactionError.details);
      } else {
        console.log('Fetched transactions:', transactionsData);
        setTransactions(transactionsData || []);
      }

      // Fetch wishes
      const { data: wishesData } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setWishes(wishesData || []);

      // Fetch previous month data for percentage calculations
      const [year, month] = selectedMonth.split('-').map(Number);
      const prevMonth = new Date(year, month - 2, 1);
      const prevYear = prevMonth.getFullYear();
      const prevMonthNum = prevMonth.getMonth() + 1;
      const prevMonthStr = `${prevYear}-${prevMonthNum.toString().padStart(2, '0')}`;
      const { startDate: prevStartDate, endDate: prevEndDate } = getMonthDateRange(prevMonthStr);

      const { data: prevTransactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', prevStartDate)
        .lte('date', prevEndDate);

      if (prevTransactionsData) {
        const prevIncome = prevTransactionsData.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
        const prevExpenses = prevTransactionsData.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
        const prevInvestments = prevTransactionsData.filter(t => t.type === 'investment').reduce((sum, t) => sum + Number(t.amount), 0);
        const prevEmi = prevTransactionsData.filter(t => t.type === 'emi').reduce((sum, t) => sum + Number(t.amount), 0);
        
        setPreviousTotals({
          balance: prevIncome - prevExpenses - prevInvestments - prevEmi,
          income: prevIncome,
          expenses: prevExpenses
        });
      }

      // Process EMI and Investment data from transactions
      const emiTransactions = transactionsData?.filter(t => t.type === 'emi') || [];
      const investmentTransactions = transactionsData?.filter(t => t.type === 'investment') || [];

      // Convert EMI transactions to EMI format
      const processedEmis = emiTransactions.map(emi => {
        let emiDetails = {};
        try {
          emiDetails = JSON.parse(emi.description || '{}');
        } catch (e) {
          console.error('Error parsing EMI details:', e);
        }

        // Calculate months paid based on emiStartDate and today
        let monthsPaid = 0;
        const details: any = emiDetails;
        if (details.emiStartDate && details.tenureMonths) {
          const start = new Date(details.emiStartDate);
          const now = new Date();
          monthsPaid = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
          // If the current date is past the EMI date in this month, count this month as paid
          if (now.getDate() >= (details.emiDate || 1)) {
            monthsPaid += 1;
          }
          if (monthsPaid < 0) monthsPaid = 0;
          if (monthsPaid > details.tenureMonths) monthsPaid = details.tenureMonths;
        }
        const remainingMonths = details.tenureMonths ? Math.max(0, details.tenureMonths - monthsPaid) : 0;

        return {
          id: emi.id,
          name: emi.title,
          type: emi.category || 'personal',
          monthlyAmount: Number(emi.amount),
          totalAmount: (emiDetails as any).loanAmount || Number(emi.amount) * 12,
          remainingMonths,
          totalMonths: (emiDetails as any).tenureMonths || 12,
          description: emi.description,
          ...emiDetails
        };
      });

      setEmis(processedEmis);

      // Convert Investment transactions to Investment format
      const processedInvestments = investmentTransactions.map(inv => {
        let invDetails = {};
        try {
          invDetails = JSON.parse(inv.description || '{}');
        } catch (e) {
          console.error('Error parsing investment details:', e);
        }

        return {
          id: inv.id,
          name: inv.title,
          type: inv.category || 'stocks',
          amount: Number(inv.amount),
          currentValue: Number(inv.amount) * 1.05, // Mock 5% gain
          change: Number(inv.amount) * 0.05,
          changePercentage: 5.0,
          ...invDetails
        };
      });

      setInvestments(processedInvestments);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        console.log('Profile updated - refetching data');
        fetchData();
        showNotification('Profile updated');
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'credit_cards'
      }, () => {
        console.log('Credit card updated - refetching data');
        fetchData();
        showNotification('Credit card updated');
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, () => {
        console.log('Transaction updated - refetching data');
        fetchData();
        showNotification('Transaction updated');
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wishes'
      }, () => {
        console.log('Wish updated - refetching data');
        fetchData();
        showNotification('Wish updated');
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const showNotification = (message: string) => {
    if (notificationsEnabled) {
      toast({
        title: "Update",
        description: message,
      });
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled ? "Notifications Disabled" : "Notifications Enabled",
      description: notificationsEnabled ? "You won't receive push notifications" : "You'll receive push notifications for updates",
    });
  };

  const getCurrencySymbol = () => {
    return profile?.currency === 'INR' ? '₹' : '$';
  };

  const getDisplayData = () => {
    if (showFakeData) {
      const fakeTransactions = fakeDataService.getFakeTransactions();
      // Generate fake EMIs and Investments from fake transactions
      const emiTransactions = fakeTransactions.filter(t => t.type === 'emi');
      const investmentTransactions = fakeTransactions.filter(t => t.type === 'investment');
      const processedEmis = emiTransactions.map(emi => ({
        id: emi.id,
        name: emi.title || 'Fake EMI',
        type: emi.category || 'personal',
        monthlyAmount: Number(emi.amount),
        totalAmount: (emi.description ? (JSON.parse(emi.description).loanAmount || Number(emi.amount) * 12) : Number(emi.amount) * 12),
        remainingMonths: (emi.description ? Math.max(1, ((JSON.parse(emi.description).tenureMonths || 12) - 1)) : 6),
        totalMonths: (emi.description ? (JSON.parse(emi.description).tenureMonths || 12) : 12)
      }));
      const processedInvestments = investmentTransactions.map(inv => ({
        id: inv.id,
        name: inv.title || 'Fake Investment',
        type: inv.category || 'stocks',
        amount: Number(inv.amount),
        currentValue: Number(inv.amount) * 1.05,
        change: Number(inv.amount) * 0.05,
        changePercentage: 5.0
      }));
      return {
        profile: fakeDataService.getFakeProfile(),
        creditCards: fakeDataService.getFakeCreditCards(),
        transactions: fakeTransactions,
        wishes: fakeDataService.getFakeWishes(),
        emis: processedEmis,
        investments: processedInvestments
      };
    }
    return { profile, creditCards, transactions, wishes, emis, investments };
  };

  const displayData = getDisplayData();

  const calculateTotals = () => {
    const income = displayData.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    // Expenses paid by cash or UPI
    const expensesNonCredit = displayData.transactions.filter(t => t.type === 'expense' && t.payment_method !== 'Credit Card').reduce((sum, t) => sum + Number(t.amount), 0);
    // Expenses paid by credit card
    const expensesCredit = displayData.transactions.filter(t => t.type === 'expense' && t.payment_method === 'Credit Card').reduce((sum, t) => sum + Number(t.amount), 0);
    const investments = displayData.transactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + Number(t.amount), 0);
    const emi = displayData.transactions.filter(t => t.type === 'emi').reduce((sum, t) => sum + Number(t.amount), 0);
    const creditCardUsage = displayData.creditCards.reduce((sum, card) => sum + Number(card.current_balance), 0);
    // Only subtract credit card usage, not expenses paid by credit card (to avoid double counting)
    return {
      income,
      expenses: expensesNonCredit + expensesCredit, // for display
      investments,
      emi,
      balance: income - expensesNonCredit - investments - emi - creditCardUsage
    };
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const totals = calculateTotals();

  const openTransactionModal = (type: 'income' | 'expense' | 'investment' | 'emi') => {
    if (type === 'emi') {
      setEnhancedEMIModalOpen(true);
    } else if (type === 'investment') {
      setEnhancedInvestmentModalOpen(true);
    } else {
      setTransactionType(type);
      setTransactionModalOpen(true);
    }
  };

  const openCreditCardModal = (card?: any) => {
    setEditingCard(card);
    setCreditCardModalOpen(true);
  };

  const openWishModal = (wish?: any) => {
    setEditingWish(wish);
    setWishModalOpen(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setEditTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    }
  };

  // Real expense data from transactions
  const expensesByCategory = displayData.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t: any) => {
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value: value as number,
    color: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb7185'][index % 6]
  })).filter(item => item.value > 0);

  // Generate monthly income and expense data from transactions for the current year
  const generateMonthlyData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const year = new Date().getFullYear();
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: months[i],
      income: 0,
      expense: 0
    }));
    displayData.transactions.forEach((t: any) => {
      const date = new Date(t.date);
      if (date.getFullYear() === year) {
        const idx = date.getMonth();
        if (t.type === 'income') monthly[idx].income += Number(t.amount);
        if (t.type === 'expense') monthly[idx].expense += Number(t.amount);
      }
    });
    return monthly;
  };
  const monthlyData = generateMonthlyData();

  const handleEditEMI = (emi: any) => {
    let lenderName = '';
    try {
      const details = typeof emi.description === 'string' ? JSON.parse(emi.description) : emi.description;
      lenderName = details?.lenderName || '';
    } catch {
      lenderName = emi.name || '';
    }
    const editEMI = {
      id: emi.id,
      category: emi.type,
      description: JSON.stringify({
        lenderName,
        loanAmount: emi.totalAmount,
        interestRate: emi.interestRate || '',
        tenureMonths: emi.totalMonths,
        emiStartDate: emi.emiStartDate || '',
        emiDate: emi.emiDate || '',
        vehicleDetails: emi.vehicleDetails || '',
        propertyAddress: emi.propertyAddress || '',
        purpose: emi.purpose || '',
        notes: emi.notes || '',
      }),
    };
    setEditingEMI(editEMI);
    setEditEMIModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        theme={theme}
        toggleTheme={toggleTheme}
        showFakeData={showFakeData}
        setShowFakeData={setShowFakeData}
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      <div className="w-full max-w-full p-2 space-y-6 lg:max-w-7xl lg:mx-auto lg:p-6">
        <OverviewCards
          totals={totals}
          previousTotals={previousTotals}
          creditCards={displayData.creditCards}
          getCurrencySymbol={getCurrencySymbol}
          onOpenTransactionModal={openTransactionModal}
          onOpenCreditCardModal={() => openCreditCardModal()}
          calculatePercentageChange={calculatePercentageChange}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover-lift bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <AnimatedPieChart data={pieData} getCurrencySymbol={getCurrencySymbol} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No expense data for this month</p>
                      <Button 
                        onClick={() => openTransactionModal('expense')} 
                        className="mt-2"
                        size="sm"
                      >
                        Add Your First Expense
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Income vs Expenses Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="hover-lift bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedLineChart data={monthlyData} getCurrencySymbol={getCurrencySymbol} />
                </CardContent>
              </Card>
            </motion.div>

            <RecentTransactions
              transactions={displayData.transactions}
              getCurrencySymbol={getCurrencySymbol}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Credit Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover-lift bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Credit Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreditCardStack
                    cards={displayData.creditCards}
                    onCardClick={openCreditCardModal}
                    onAddCard={() => openCreditCardModal()}
                    getCurrencySymbol={getCurrencySymbol}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* EMI Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="hover-lift bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    EMI Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EMITracker
                    emis={displayData.emis}
                    getCurrencySymbol={getCurrencySymbol}
                    onAddEMI={() => setEnhancedEMIModalOpen(true)}
                    onEditEMI={handleEditEMI}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Investment Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="hover-lift bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-green-600" />
                    Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InvestmentTracker
                    investments={displayData.investments}
                    getCurrencySymbol={getCurrencySymbol}
                    onAddInvestment={() => setEnhancedInvestmentModalOpen(true)}
                    onEditInvestment={(investment) => { setEditingInvestment(investment); setEditInvestmentModalOpen(true); }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <WishesSection
              wishes={displayData.wishes}
              getCurrencySymbol={getCurrencySymbol}
              onOpenWishModal={openWishModal}
            />
          </div>
        </div>
      </div>

      <DashboardModals
        profileModalOpen={profileModalOpen}
        setProfileModalOpen={setProfileModalOpen}
        transactionModalOpen={transactionModalOpen}
        setTransactionModalOpen={setTransactionModalOpen}
        transactionType={transactionType}
        creditCardModalOpen={creditCardModalOpen}
        setCreditCardModalOpen={setCreditCardModalOpen}
        editingCard={editingCard}
        wishModalOpen={wishModalOpen}
        setWishModalOpen={setWishModalOpen}
        editingWish={editingWish}
        onDataCleared={fetchData}
        onDataChanged={fetchData}
      />

      <EnhancedEMIForm 
        open={enhancedEMIModalOpen} 
        onOpenChange={setEnhancedEMIModalOpen} 
        onDataChanged={fetchData}
      />
      
      <EnhancedInvestmentForm 
        open={enhancedInvestmentModalOpen} 
        onOpenChange={setEnhancedInvestmentModalOpen} 
        onDataChanged={fetchData}
      />

      <EditTransactionModal
        open={editTransactionModalOpen}
        onOpenChange={setEditTransactionModalOpen}
        transaction={editingTransaction}
      />

      <EditEMIModal
        open={editEMIModalOpen}
        onOpenChange={setEditEMIModalOpen}
        editEMI={editingEMI}
        onDataChanged={fetchData}
      />
      <EditInvestmentModal
        open={editInvestmentModalOpen}
        onOpenChange={setEditInvestmentModalOpen}
        editInvestment={editingInvestment}
        onDataChanged={fetchData}
      />
    </div>
  );
};

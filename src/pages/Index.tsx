import { useState, createContext } from "react";
import { DashboardHeader, CurrencyContext } from "../components/dashboard/DashboardHeader";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { CreditCardsList } from "@/components/dashboard/CreditCardsList";
import { EMITracker } from "@/components/dashboard/EMITracker";
import { InvestmentPortfolio } from "@/components/dashboard/InvestmentPortfolio";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export const FakeDataContext = createContext({
  showFakeData: false,
  setShowFakeData: (show: boolean) => {},
});

const Index = () => {
  const [currency, setCurrency] = useState("USD");
  const [showFakeData, setShowFakeData] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
          <FakeDataContext.Provider value={{ showFakeData, setShowFakeData }}>
            <DashboardHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <FinancialOverview />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ExpenseChart />
                  <IncomeExpenseChart />
                </div>
                <RecentTransactions />
              </div>
              <div className="space-y-6">
                <CreditCardsList />
                <EMITracker />
                <InvestmentPortfolio />
              </div>
            </div>
          </FakeDataContext.Provider>
        </CurrencyContext.Provider>
      </div>
    </div>
  );
};

export default Index;

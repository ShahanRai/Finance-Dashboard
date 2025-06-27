import { ArrowUpRight, ArrowDownRight, CreditCard, TrendingUp } from "lucide-react";
import { useContext } from "react";
import { CurrencyContext } from "./DashboardHeader";
import { FakeDataContext } from "@/pages/Index";

const realOverviewData = [
  {
    title: "Total Balance",
    amount: 24580.00,
    change: "+12.5%",
    changeType: "positive",
    icon: TrendingUp,
    gradient: "from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30"
  },
  {
    title: "Monthly Income",
    amount: 8240.00,
    change: "+8.2%",
    changeType: "positive",
    icon: ArrowUpRight,
    gradient: "from-blue-100 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-800/30"
  },
  {
    title: "Monthly Expenses",
    amount: 3420.00,
    change: "-5.1%",
    changeType: "negative",
    icon: ArrowDownRight,
    gradient: "from-orange-100 to-red-200 dark:from-orange-900/30 dark:to-red-800/30"
  },
  {
    title: "Credit Used",
    amount: 1250.00,
    change: "25% of limit",
    changeType: "neutral",
    icon: CreditCard,
    gradient: "from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-800/30"
  }
];

const fakeOverviewData = [
  {
    title: "Total Balance",
    amount: 99999.99,
    change: "+99.9%",
    changeType: "positive",
    icon: TrendingUp,
    gradient: "from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30"
  },
  {
    title: "Monthly Income",
    amount: 12345.67,
    change: "+12.3%",
    changeType: "positive",
    icon: ArrowUpRight,
    gradient: "from-blue-100 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-800/30"
  },
  {
    title: "Monthly Expenses",
    amount: 5432.10,
    change: "-1.2%",
    changeType: "negative",
    icon: ArrowDownRight,
    gradient: "from-orange-100 to-red-200 dark:from-orange-900/30 dark:to-red-800/30"
  },
  {
    title: "Credit Used",
    amount: 4321.00,
    change: "43% of limit",
    changeType: "neutral",
    icon: CreditCard,
    gradient: "from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-800/30"
  }
];

export const FinancialOverview = () => {
  const { currency } = useContext(CurrencyContext);
  const { showFakeData } = useContext(FakeDataContext);
  const currencySymbol = currency === "INR" ? "\u20b9" : "$";
  const overviewData = showFakeData ? fakeOverviewData : realOverviewData;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {overviewData.map((item, index) => (
        <div
          key={item.title}
          className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${item.gradient} shadow-sm`}>
              <item.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
            {item.title === "Credit Used" && (
              <span className={`ml-auto text-sm font-medium px-2 py-1 rounded-full text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30`} style={{marginLeft: 'auto'}}>
                {item.change}
              </span>
            )}
            {item.title !== "Credit Used" && (
              <span
                className={`ml-auto text-sm font-medium px-2 py-1 rounded-full ${
                  item.changeType === "positive"
                    ? "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30"
                    : item.changeType === "negative"
                    ? "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                    : "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30"
                }`}
              >
                {item.change}
              </span>
            )}
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{item.title}</h3>
          <p className="text-gray-800 dark:text-gray-100 text-2xl font-bold">{currencySymbol}{item.amount.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

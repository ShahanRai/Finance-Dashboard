import { TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Edit, Trash2, Eye, PieChart } from "lucide-react";
import { useState, useContext } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, SelectField, FormActions } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { CurrencyContext } from "./DashboardHeader";
import { FakeDataContext } from "@/pages/Index";

interface Investment {
  id: number;
  name: string;
  amount: number;
  change: number;
  changeAmount: number;
  type: string;
  symbol?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  notes?: string;
}

const fakeInvestments: Investment[] = [
  {
    id: 1001,
    name: "Real Estate",
    amount: 5000000,
    change: 15.2,
    changeAmount: 660000,
    type: "Real Estate",
    symbol: "N/A",
    purchaseDate: "2020-05-01",
    purchasePrice: 4340000,
    currentPrice: 5000000,
    quantity: 1,
    notes: "Luxury apartment in Mumbai"
  },
  {
    id: 1002,
    name: "Stocks",
    amount: 250000,
    change: 8.5,
    changeAmount: 19600,
    type: "Stocks",
    symbol: "TCS, INFY, RELIANCE",
    purchaseDate: "2022-01-10",
    purchasePrice: 230400,
    currentPrice: 250000,
    quantity: 200,
    notes: "Indian bluechip stocks"
  },
  {
    id: 1003,
    name: "Cryptocurrency",
    amount: 120000,
    change: -5.2,
    changeAmount: -6500,
    type: "Cryptocurrency",
    symbol: "BTC, ETH",
    purchaseDate: "2023-03-10",
    purchasePrice: 126500,
    currentPrice: 120000,
    quantity: 2,
    notes: "Bitcoin and Ethereum holdings"
  }
];

// Define a type for the investment form state
type InvestmentFormState = {
  name: string;
  type: string;
  symbol: string;
  purchaseDate: string;
  purchasePrice: string;
  currentPrice: string;
  quantity: string;
  notes: string;
};

const investmentTypeDefaults: Record<string, Partial<InvestmentFormState>> = {
  "Stocks": {
    symbol: "AAPL, GOOGL, MSFT",
    notes: "Tech stocks portfolio",
    purchasePrice: "150.00",
    currentPrice: "154.20",
    quantity: "100"
  },
  "Mutual Funds": {
    symbol: "VTSAX, VFIAX",
    notes: "Index funds for long-term growth",
    purchasePrice: "164.00",
    currentPrice: "173.00",
    quantity: "50"
  },
  "Cryptocurrency": {
    symbol: "BTC, ETH",
    notes: "Bitcoin and Ethereum holdings",
    purchasePrice: "2670.00",
    currentPrice: "2340.00",
    quantity: "0.5"
  },
  "Bonds": {
    symbol: "US10Y",
    notes: "US Treasury Bonds",
    purchasePrice: "1000.00",
    currentPrice: "1020.00",
    quantity: "10"
  },
  "ETFs": {
    symbol: "SPY, QQQ",
    notes: "Exchange Traded Funds",
    purchasePrice: "400.00",
    currentPrice: "420.00",
    quantity: "20"
  },
  "Real Estate": {
    symbol: "N/A",
    notes: "Luxury apartment in Mumbai",
    purchasePrice: "4340000",
    currentPrice: "5000000",
    quantity: "1"
  },
  "Commodities": {
    symbol: "GOLD, SILVER",
    notes: "Precious metals",
    purchasePrice: "50000.00",
    currentPrice: "52000.00",
    quantity: "5"
  },
  "Other": {
    symbol: "",
    notes: "Other investment",
    purchasePrice: "1000.00",
    currentPrice: "1000.00",
    quantity: "1"
  }
};

export const InvestmentPortfolio = () => {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: 1,
      name: "Stocks",
      amount: 15420,
      change: 8.2,
      changeAmount: 1240,
      type: "Stocks",
      symbol: "AAPL, GOOGL, MSFT",
      purchaseDate: "2022-01-15",
      purchasePrice: 14200,
      currentPrice: 15420,
      quantity: 100,
      notes: "Tech stocks portfolio"
    },
    {
      id: 2,
      name: "Mutual Funds",
      amount: 8650,
      change: 5.7,
      changeAmount: 467,
      type: "Mutual Funds",
      symbol: "VTSAX, VFIAX",
      purchaseDate: "2021-06-20",
      purchasePrice: 8200,
      currentPrice: 8650,
      quantity: 50,
      notes: "Index funds for long-term growth"
    },
    {
      id: 3,
      name: "Crypto",
      amount: 2340,
      change: -12.3,
      changeAmount: -330,
      type: "Cryptocurrency",
      symbol: "BTC, ETH",
      purchaseDate: "2023-03-10",
      purchasePrice: 2670,
      currentPrice: 2340,
      quantity: 0.5,
      notes: "Bitcoin and Ethereum holdings"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new investment
  const [newInvestment, setNewInvestment] = useState({
    name: "",
    type: "Stocks",
    symbol: "",
    purchaseDate: "",
    purchasePrice: "",
    currentPrice: "",
    quantity: "",
    notes: ""
  });

  // Form state for editing investment
  const [editInvestment, setEditInvestment] = useState({
    name: "",
    type: "Stocks",
    symbol: "",
    purchaseDate: "",
    purchasePrice: "",
    currentPrice: "",
    quantity: "",
    notes: ""
  });

  const { currency } = useContext(CurrencyContext);
  const { showFakeData } = useContext(FakeDataContext);
  const currencySymbol = currency === "INR" ? "\u20b9" : "$";
  const data = showFakeData ? fakeInvestments : investments;

  const investmentTypeOptions = [
    { value: "Stocks", label: "Stocks" },
    { value: "Mutual Funds", label: "Mutual Funds" },
    { value: "Cryptocurrency", label: "Cryptocurrency" },
    { value: "Bonds", label: "Bonds" },
    { value: "ETFs", label: "ETFs" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Commodities", label: "Commodities" },
    { value: "Other", label: "Other" }
  ];

  const calculateInvestmentMetrics = (investment: Investment) => {
    const purchaseValue = investment.purchasePrice * investment.quantity;
    const currentValue = investment.currentPrice * investment.quantity;
    const changeAmount = currentValue - purchaseValue;
    const changePercent = (changeAmount / purchaseValue) * 100;
    
    return {
      purchaseValue,
      currentValue,
      changeAmount,
      changePercent
    };
  };

  const handleAddInvestment = () => {
    setIsLoading(true);
    setTimeout(() => {
      const purchasePrice = parseFloat(newInvestment.purchasePrice);
      const currentPrice = parseFloat(newInvestment.currentPrice);
      const quantity = parseFloat(newInvestment.quantity);
      
      const metrics = calculateInvestmentMetrics({
        id: 0,
        name: newInvestment.name,
        amount: currentPrice * quantity,
        change: 0,
        changeAmount: 0,
        type: newInvestment.type,
        symbol: newInvestment.symbol,
        purchaseDate: newInvestment.purchaseDate,
        purchasePrice,
        currentPrice,
        quantity,
        notes: newInvestment.notes
      });

      const investment: Investment = {
        id: Date.now(),
        name: newInvestment.name,
        amount: metrics.currentValue,
        change: metrics.changePercent,
        changeAmount: metrics.changeAmount,
        type: newInvestment.type,
        symbol: newInvestment.symbol,
        purchaseDate: newInvestment.purchaseDate,
        purchasePrice,
        currentPrice,
        quantity,
        notes: newInvestment.notes
      };

      setInvestments([...investments, investment]);
      setNewInvestment({
        name: "",
        type: "Stocks",
        symbol: "",
        purchaseDate: "",
        purchasePrice: "",
        currentPrice: "",
        quantity: "",
        notes: ""
      });
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditInvestment = () => {
    if (!selectedInvestment) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const purchasePrice = parseFloat(editInvestment.purchasePrice);
      const currentPrice = parseFloat(editInvestment.currentPrice);
      const quantity = parseFloat(editInvestment.quantity);
      
      const metrics = calculateInvestmentMetrics({
        id: selectedInvestment.id,
        name: editInvestment.name,
        amount: currentPrice * quantity,
        change: 0,
        changeAmount: 0,
        type: editInvestment.type,
        symbol: editInvestment.symbol,
        purchaseDate: editInvestment.purchaseDate,
        purchasePrice,
        currentPrice,
        quantity,
        notes: editInvestment.notes
      });

      const updatedInvestments = investments.map(inv => 
        inv.id === selectedInvestment.id 
          ? {
              ...inv,
              name: editInvestment.name,
              amount: metrics.currentValue,
              change: metrics.changePercent,
              changeAmount: metrics.changeAmount,
              type: editInvestment.type,
              symbol: editInvestment.symbol,
              purchaseDate: editInvestment.purchaseDate,
              purchasePrice,
              currentPrice,
              quantity,
              notes: editInvestment.notes
            }
          : inv
      );
      setInvestments(updatedInvestments);
      setIsEditModalOpen(false);
      setSelectedInvestment(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteInvestment = (id: number) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  const openViewModal = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsViewModalOpen(true);
  };

  const openEditModal = (investment: Investment) => {
    setSelectedInvestment(investment);
    setEditInvestment({
      name: investment.name,
      type: investment.type,
      symbol: investment.symbol || "",
      purchaseDate: investment.purchaseDate,
      purchasePrice: investment.purchasePrice.toString(),
      currentPrice: investment.currentPrice.toString(),
      quantity: investment.quantity.toString(),
      notes: investment.notes || ""
    });
    setIsEditModalOpen(true);
  };

  const totalValue = data.reduce((sum, inv) => sum + inv.amount, 0);
  const totalGain = data.reduce((sum, inv) => sum + inv.changeAmount, 0);
  const totalGainPercentage = totalValue > 0 ? (totalGain / (totalValue - totalGain)) * 100 : 0;

  // Auto-populate fields on investment type change (add modal)
  const handleTypeChange = (value: string) => {
    setNewInvestment((prev) => ({
      ...prev,
      type: value,
      ...investmentTypeDefaults[value]
    }));
  };

  // Auto-populate fields on investment type change (edit modal)
  const handleEditTypeChange = (value: string) => {
    setEditInvestment((prev) => ({
      ...prev,
      type: value,
      ...investmentTypeDefaults[value]
    }));
  };

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 dark:text-gray-100 text-xl font-semibold flex items-center">Investments</h3>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" variant="glass" className="ml-2 flex items-center gap-1">
            <Plus className="h-4 w-4" /> Investment
          </Button>
        </div>
        <div className="mb-4">
          <div className="rounded-lg p-4 bg-emerald-50 dark:bg-emerald-900/20 flex items-center gap-4">
            <div className="flex-1">
              <div className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">Total Portfolio Value</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{currencySymbol}{totalValue.toLocaleString()}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${totalGain >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}
                style={{ minWidth: 70, textAlign: 'center' }}>
                {totalGain >= 0 ? '+' : ''}{totalGainPercentage.toFixed(1)}%
              </span>
              <span className={`text-xs ${totalGain >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>({totalGain >= 0 ? '+' : ''}{currencySymbol}{Math.abs(totalGain).toLocaleString()})</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {data.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-white/80 dark:bg-gray-800/60 shadow-sm">
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">{inv.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{inv.symbol}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">{currencySymbol}{inv.amount.toLocaleString()}</div>
                  <div className={`text-xs ${inv.change >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>{inv.change >= 0 ? '+' : ''}{inv.change.toFixed(2)}%</div>
                  <div className={`text-xs ${inv.changeAmount >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>{inv.changeAmount >= 0 ? '+' : ''}{currencySymbol}{Math.abs(inv.changeAmount).toLocaleString()}</div>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => openViewModal(inv)} variant="ghost" size="icon" className="text-gray-500 hover:text-blue-700 h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  <Button onClick={() => openEditModal(inv)} variant="ghost" size="icon" className="text-gray-500 hover:text-blue-700 h-8 w-8"><Edit className="h-4 w-4" /></Button>
                  <Button onClick={() => handleDeleteInvestment(inv.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700 h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Investment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Investment"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Investment Name"
              name="name"
              placeholder="e.g., Tech Stocks Portfolio"
              value={newInvestment.name}
              onChange={(value) => setNewInvestment({ ...newInvestment, name: value })}
              required
            />
            <SelectField
              label="Investment Type"
              name="type"
              value={newInvestment.type}
              onValueChange={handleTypeChange}
              options={investmentTypeOptions}
              required
            />
            <FormField
              label="Symbol/Ticker (Optional)"
              name="symbol"
              placeholder="AAPL, GOOGL, BTC"
              value={newInvestment.symbol}
              onChange={(value) => setNewInvestment({ ...newInvestment, symbol: value })}
            />
            <FormField
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={newInvestment.purchaseDate}
              onChange={(value) => setNewInvestment({ ...newInvestment, purchaseDate: value })}
              required
            />
            <FormField
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              placeholder="150.00"
              value={newInvestment.purchasePrice}
              onChange={(value) => setNewInvestment({ ...newInvestment, purchasePrice: value })}
              required
            />
            <FormField
              label="Current Price"
              name="currentPrice"
              type="number"
              placeholder="165.00"
              value={newInvestment.currentPrice}
              onChange={(value) => setNewInvestment({ ...newInvestment, currentPrice: value })}
              required
            />
            <FormField
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="100"
              value={newInvestment.quantity}
              onChange={(value) => setNewInvestment({ ...newInvestment, quantity: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about the investment"
              value={newInvestment.notes}
              onChange={(value) => setNewInvestment({ ...newInvestment, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={handleAddInvestment}
            submitText="Add Investment"
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* View Investment Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Investment Details"
        size="md"
      >
        {selectedInvestment && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {selectedInvestment.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedInvestment.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Value</label>
                <p className="text-xl font-bold text-emerald-600">${selectedInvestment.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Return</label>
                <p className={`text-lg font-semibold ${selectedInvestment.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {selectedInvestment.change >= 0 ? '+' : ''}{selectedInvestment.change}%
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Purchase Price</label>
                <p className="text-gray-800 dark:text-gray-100">${selectedInvestment.purchasePrice}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Price</label>
                <p className="text-gray-800 dark:text-gray-100">${selectedInvestment.currentPrice}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedInvestment.quantity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Purchase Date</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedInvestment.purchaseDate}</p>
              </div>
              {selectedInvestment.symbol && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Symbol/Ticker</label>
                  <p className="text-gray-800 dark:text-gray-100">{selectedInvestment.symbol}</p>
                </div>
              )}
            </div>

            {selectedInvestment.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                <p className="text-gray-800 dark:text-gray-100 mt-1">{selectedInvestment.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedInvestment);
                }}
                className="text-gray-600 dark:text-gray-300"
              >
                Edit Investment
              </Button>
              <Button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Investment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Investment"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Investment Name"
              name="name"
              placeholder="e.g., Tech Stocks Portfolio"
              value={editInvestment.name}
              onChange={(value) => setEditInvestment({ ...editInvestment, name: value })}
              required
            />
            <SelectField
              label="Investment Type"
              name="type"
              value={editInvestment.type}
              onValueChange={handleEditTypeChange}
              options={investmentTypeOptions}
              required
            />
            <FormField
              label="Symbol/Ticker (Optional)"
              name="symbol"
              placeholder="AAPL, GOOGL, BTC"
              value={editInvestment.symbol}
              onChange={(value) => setEditInvestment({ ...editInvestment, symbol: value })}
            />
            <FormField
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={editInvestment.purchaseDate}
              onChange={(value) => setEditInvestment({ ...editInvestment, purchaseDate: value })}
              required
            />
            <FormField
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              placeholder="150.00"
              value={editInvestment.purchasePrice}
              onChange={(value) => setEditInvestment({ ...editInvestment, purchasePrice: value })}
              required
            />
            <FormField
              label="Current Price"
              name="currentPrice"
              type="number"
              placeholder="165.00"
              value={editInvestment.currentPrice}
              onChange={(value) => setEditInvestment({ ...editInvestment, currentPrice: value })}
              required
            />
            <FormField
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="100"
              value={editInvestment.quantity}
              onChange={(value) => setEditInvestment({ ...editInvestment, quantity: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about the investment"
              value={editInvestment.notes}
              onChange={(value) => setEditInvestment({ ...editInvestment, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditInvestment}
            submitText="Update Investment"
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </>
  );
};

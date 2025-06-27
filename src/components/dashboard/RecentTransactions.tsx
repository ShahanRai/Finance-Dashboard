import { ArrowUpRight, ArrowDownRight, ShoppingBag, Car, Home, Utensils, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useState, useContext } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, SelectField, FormActions } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { CurrencyContext } from "./DashboardHeader";
import { FakeDataContext } from "@/pages/Index";

interface Transaction {
  id: number;
  type: "expense" | "income";
  description: string;
  amount: number;
  date: string;
  category: string;
  icon: any;
  notes?: string;
}

const categoryOptions = [
  { value: "Food", label: "Food & Dining" },
  { value: "Transport", label: "Transportation" },
  { value: "Shopping", label: "Shopping" },
  { value: "Bills", label: "Bills & Utilities" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Income", label: "Income" },
  { value: "Investment", label: "Investment" },
  { value: "Other", label: "Other" }
];

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: any } = {
    Food: Utensils,
    Transport: Car,
    Shopping: ShoppingBag,
    Bills: Home,
    Entertainment: ShoppingBag,
    Healthcare: Home,
    Education: Home,
    Income: ArrowUpRight,
    Investment: ArrowUpRight,
    Other: ShoppingBag
  };
  return icons[category] || ShoppingBag;
};

const fakeTransactions: Transaction[] = [
  {
    id: 1001,
    type: "expense",
    description: "Fake Grocery Shopping",
    amount: 1156.80,
    date: "Today",
    category: "Food",
    icon: Utensils,
    notes: "Fake groceries"
  },
  {
    id: 1002,
    type: "income",
    description: "Fake Salary Credit",
    amount: 14200.00,
    date: "Yesterday",
    category: "Income",
    icon: ArrowUpRight,
    notes: "Fake salary"
  },
  {
    id: 1003,
    type: "expense",
    description: "Fake Gas Station",
    amount: 168.50,
    date: "2 days ago",
    category: "Transport",
    icon: Car,
    notes: "Fake fuel"
  },
  {
    id: 1004,
    type: "expense",
    description: "Fake Online Shopping",
    amount: 1249.99,
    date: "3 days ago",
    category: "Shopping",
    icon: ShoppingBag,
    notes: "Fake electronics"
  },
  {
    id: 1005,
    type: "expense",
    description: "Fake Electricity Bill",
    amount: 1127.30,
    date: "4 days ago",
    category: "Bills",
    icon: Home,
    notes: "Fake bill"
  }
];

export const RecentTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "expense",
      description: "Grocery Shopping",
      amount: 156.80,
      date: "Today",
      category: "Food",
      icon: Utensils,
      notes: "Weekly groceries from Walmart"
    },
    {
      id: 2,
      type: "income",
      description: "Salary Credit",
      amount: 4200.00,
      date: "Yesterday",
      category: "Income",
      icon: ArrowUpRight,
      notes: "Monthly salary from ABC Corp"
    },
    {
      id: 3,
      type: "expense",
      description: "Gas Station",
      amount: 68.50,
      date: "2 days ago",
      category: "Transport",
      icon: Car,
      notes: "Fuel for car"
    },
    {
      id: 4,
      type: "expense",
      description: "Online Shopping",
      amount: 249.99,
      date: "3 days ago",
      category: "Shopping",
      icon: ShoppingBag,
      notes: "Amazon purchase - electronics"
    },
    {
      id: 5,
      type: "expense",
      description: "Electricity Bill",
      amount: 127.30,
      date: "4 days ago",
      category: "Bills",
      icon: Home,
      notes: "Monthly electricity bill"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new transaction
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  // Form state for editing transaction
  const [editTransaction, setEditTransaction] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "Food",
    date: "",
    notes: ""
  });

  const { currency } = useContext(CurrencyContext);
  const { showFakeData } = useContext(FakeDataContext);
  const currencySymbol = currency === "INR" ? "\u20b9" : "$";
  const data = showFakeData ? fakeTransactions : transactions;

  const handleAddTransaction = () => {
    setIsLoading(true);
    setTimeout(() => {
      const transaction: Transaction = {
        id: Date.now(),
        type: newTransaction.type as "expense" | "income",
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        date: newTransaction.date,
        category: newTransaction.category,
        icon: getCategoryIcon(newTransaction.category),
        notes: newTransaction.notes
      };

      setTransactions([transaction, ...transactions]);
      setNewTransaction({
        type: "expense",
        description: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditTransaction = () => {
    if (!selectedTransaction) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updatedTransactions = transactions.map(t => 
        t.id === selectedTransaction.id 
          ? {
              ...t,
              type: editTransaction.type as "expense" | "income",
              description: editTransaction.description,
              amount: parseFloat(editTransaction.amount),
              category: editTransaction.category,
              icon: getCategoryIcon(editTransaction.category),
              notes: editTransaction.notes
            }
          : t
      );
      setTransactions(updatedTransactions);
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const openViewModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditTransaction({
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      notes: transaction.notes || ""
    });
    setIsEditModalOpen(true);
  };

  const totalIncome = data
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = data
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-800 dark:text-gray-100 text-xl font-semibold flex items-center">Recent Transactions</h3>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            variant="glass"
            className="ml-2 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Transaction
          </Button>
        </div>
        
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-emerald-600 dark:text-emerald-400">Income: {currencySymbol}{totalIncome.toFixed(2)}</span>
          <span className="text-red-600 dark:text-red-400">Expenses: {currencySymbol}{totalExpenses.toFixed(2)}</span>
        </div>
        
        <div className="space-y-4">
          {data.slice(0, 5).map((transaction, index) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/30 dark:hover:bg-gray-800/30 transition-all duration-200 hover:scale-105 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                <transaction.icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1">
                <div className="text-gray-800 dark:text-gray-100 font-medium">{transaction.description}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{transaction.date} • {transaction.category}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`text-right font-semibold ${
                  transaction.type === 'income' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{transaction.amount.toFixed(2)}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openViewModal(transaction)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(transaction)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {transactions.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              View All ({transactions.length} transactions)
            </Button>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Transaction"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Transaction Type"
              name="type"
              value={newTransaction.type}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
              options={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" }
              ]}
              required
            />
            <FormField
              label="Amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={newTransaction.amount}
              onChange={(value) => setNewTransaction({ ...newTransaction, amount: value })}
              required
            />
            <FormField
              label="Description"
              name="description"
              placeholder="Enter transaction description"
              value={newTransaction.description}
              onChange={(value) => setNewTransaction({ ...newTransaction, description: value })}
              required
            />
            <SelectField
              label="Category"
              name="category"
              value={newTransaction.category}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
              options={categoryOptions}
              required
            />
            <FormField
              label="Date"
              name="date"
              type="date"
              value={newTransaction.date}
              onChange={(value) => setNewTransaction({ ...newTransaction, date: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Add any additional notes"
              value={newTransaction.notes}
              onChange={(value) => setNewTransaction({ ...newTransaction, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={handleAddTransaction}
            submitText="Add Transaction"
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* View Transaction Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Transaction Details"
        size="md"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
              <div className={`p-3 rounded-lg ${
                selectedTransaction.type === 'income' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                <selectedTransaction.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {selectedTransaction.description}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedTransaction.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
                <p className={`text-xl font-bold ${
                  selectedTransaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'income' ? '+' : '-'}{currencySymbol}{selectedTransaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedTransaction.date}</p>
              </div>
            </div>

            {selectedTransaction.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                <p className="text-gray-800 dark:text-gray-100 mt-1">{selectedTransaction.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedTransaction);
                }}
                className="text-gray-600 dark:text-gray-300"
              >
                Edit Transaction
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

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Transaction"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Transaction Type"
              name="type"
              value={editTransaction.type}
              onValueChange={(value) => setEditTransaction({ ...editTransaction, type: value })}
              options={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" }
              ]}
              required
            />
            <FormField
              label="Amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={editTransaction.amount}
              onChange={(value) => setEditTransaction({ ...editTransaction, amount: value })}
              required
            />
            <FormField
              label="Description"
              name="description"
              placeholder="Enter transaction description"
              value={editTransaction.description}
              onChange={(value) => setEditTransaction({ ...editTransaction, description: value })}
              required
            />
            <SelectField
              label="Category"
              name="category"
              value={editTransaction.category}
              onValueChange={(value) => setEditTransaction({ ...editTransaction, category: value })}
              options={categoryOptions}
              required
            />
            <FormField
              label="Date"
              name="date"
              type="date"
              value={editTransaction.date}
              onChange={(value) => setEditTransaction({ ...editTransaction, date: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Add any additional notes"
              value={editTransaction.notes}
              onChange={(value) => setEditTransaction({ ...editTransaction, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditTransaction}
            submitText="Update Transaction"
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </>
  );
};

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { useState, useContext } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, FormActions } from "@/components/ui/form-elements";
import { CurrencyContext } from "./DashboardHeader";
import { FakeDataContext } from "@/pages/Index";

interface ExpenseCategory {
  id: number;
  name: string;
  value: number;
  color: string;
  budget?: number;
  notes?: string;
}

const fakeExpenseData: ExpenseCategory[] = [
  { id: 101, name: "Food & Dining", value: 2200, color: "#93c5fd", budget: 2500, notes: "Fake groceries and dining" },
  { id: 102, name: "Transportation", value: 1800, color: "#86efac", budget: 2000, notes: "Fake transport" },
  { id: 103, name: "Shopping", value: 1600, color: "#fbbf24", budget: 1800, notes: "Fake shopping" },
  { id: 104, name: "Entertainment", value: 900, color: "#fca5a5", budget: 1000, notes: "Fake entertainment" },
  { id: 105, name: "Bills & Utilities", value: 820, color: "#c4b5fd", budget: 900, notes: "Fake bills" },
];

const chartConfig = {
  food: { label: "Food & Dining", color: "#93c5fd" },
  transport: { label: "Transportation", color: "#86efac" },
  shopping: { label: "Shopping", color: "#fbbf24" },
  entertainment: { label: "Entertainment", color: "#fca5a5" },
  bills: { label: "Bills & Utilities", color: "#c4b5fd" },
};

export const ExpenseChart = () => {
  const [expenseData, setExpenseData] = useState<ExpenseCategory[]>([
    { id: 1, name: "Food & Dining", value: 1200, color: "#93c5fd", budget: 1500, notes: "Groceries and dining out" },
    { id: 2, name: "Transportation", value: 800, color: "#86efac", budget: 1000, notes: "Gas, public transport, rideshare" },
    { id: 3, name: "Shopping", value: 600, color: "#fbbf24", budget: 800, notes: "Clothing, electronics, miscellaneous" },
    { id: 4, name: "Entertainment", value: 400, color: "#fca5a5", budget: 500, notes: "Movies, games, hobbies" },
    { id: 5, name: "Bills & Utilities", value: 420, color: "#c4b5fd", budget: 450, notes: "Electricity, water, internet" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new category
  const [newCategory, setNewCategory] = useState({
    name: "",
    value: "",
    budget: "",
    notes: ""
  });

  // Form state for editing category
  const [editCategory, setEditCategory] = useState({
    name: "",
    value: "",
    budget: "",
    notes: ""
  });

  const colors = ["#93c5fd", "#86efac", "#fbbf24", "#fca5a5", "#c4b5fd", "#f472b6", "#a78bfa", "#34d399", "#fbbf24", "#f87171"];

  const { currency } = useContext(CurrencyContext);
  const { showFakeData } = useContext(FakeDataContext);
  const currencySymbol = currency === "INR" ? "\u20b9" : "$";
  const data = showFakeData ? fakeExpenseData : expenseData;

  const handleAddExpenseCategory = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const category: ExpenseCategory = {
        id: Date.now(),
        name: newCategory.name,
        value: parseInt(newCategory.value),
        color: randomColor,
        budget: newCategory.budget ? parseInt(newCategory.budget) : undefined,
        notes: newCategory.notes
      };

      setExpenseData([...expenseData, category]);
      setNewCategory({
        name: "",
        value: "",
        budget: "",
        notes: ""
      });
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditExpenseCategory = () => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updatedCategories = expenseData.map(cat => 
        cat.id === selectedCategory.id 
          ? {
              ...cat,
              name: editCategory.name,
              value: parseInt(editCategory.value),
              budget: editCategory.budget ? parseInt(editCategory.budget) : undefined,
              notes: editCategory.notes
            }
          : cat
      );
      setExpenseData(updatedCategories);
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setIsLoading(false);
    }, 1000);
  };

  const deleteExpenseCategory = (id: number) => {
    setExpenseData(expenseData.filter((_, i) => i !== id));
  };

  const openViewModal = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const openEditModal = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setEditCategory({
      name: category.name,
      value: category.value.toString(),
      budget: category.budget?.toString() || "",
      notes: category.notes || ""
    });
    setIsEditModalOpen(true);
  };

  const totalExpenses = data.reduce((sum, cat) => sum + cat.value, 0);
  const totalBudget = data.reduce((sum, cat) => sum + (cat.budget || 0), 0);

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-800 dark:text-gray-100 text-xl font-semibold flex items-center">Expense Breakdown</h3>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            variant="glass"
            className="ml-2 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Category
          </Button>
        </div>
        
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-red-600 dark:text-red-400">Total: {currencySymbol}{totalExpenses.toLocaleString()}</span>
          {totalBudget > 0 && (
            <span className={`${totalExpenses > totalBudget ? 'text-red-600' : 'text-emerald-600'}`}>
              Budget: {currencySymbol}{totalBudget.toLocaleString()}
            </span>
          )}
        </div>
        
        <div className="h-64 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6 space-y-3 max-h-40 overflow-y-auto">
          {data.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between animate-fade-in group">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-gray-800 dark:text-gray-100 font-medium">{currencySymbol}{item.value.toLocaleString()}</span>
                  {item.budget && (
                    <div className={`text-xs ${item.value > item.budget ? 'text-red-600' : 'text-emerald-600'}`}>
                      {currencySymbol}{item.value.toLocaleString()}/{item.budget.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    onClick={() => openViewModal(item)}
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => openEditModal(item)}
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-gray-500 hover:text-blue-700"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => deleteExpenseCategory(item.id)}
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Expense Category"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField
              label="Category Name"
              name="name"
              placeholder="e.g., Healthcare"
              value={newCategory.name}
              onChange={(value) => setNewCategory({ ...newCategory, name: value })}
              required
            />
            <FormField
              label="Amount"
              name="value"
              type="number"
              placeholder="500"
              value={newCategory.value}
              onChange={(value) => setNewCategory({ ...newCategory, value: value })}
              required
            />
            <FormField
              label="Monthly Budget (Optional)"
              name="budget"
              type="number"
              placeholder="600"
              value={newCategory.budget}
              onChange={(value) => setNewCategory({ ...newCategory, budget: value })}
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about this category"
              value={newCategory.notes}
              onChange={(value) => setNewCategory({ ...newCategory, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={handleAddExpenseCategory}
            submitText="Add Category"
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* View Category Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Category Details"
        size="sm"
      >
        {selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedCategory.color }}
              >
                <span className="text-white font-bold text-lg">
                  {selectedCategory.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {selectedCategory.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Expense Category</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Amount</label>
                <p className="text-2xl font-bold text-red-600">{currencySymbol}{selectedCategory.value.toLocaleString()}</p>
              </div>
              {selectedCategory.budget && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Budget</label>
                  <p className="text-gray-800 dark:text-gray-100">{currencySymbol}{selectedCategory.budget.toLocaleString()}</p>
                  <div className={`text-sm mt-1 ${selectedCategory.value > selectedCategory.budget ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedCategory.value > selectedCategory.budget ? 'Over budget' : 'Under budget'} by {currencySymbol}{Math.abs(selectedCategory.value - selectedCategory.budget).toLocaleString()}
                  </div>
                </div>
              )}
              {selectedCategory.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                  <p className="text-gray-800 dark:text-gray-100 mt-1">{selectedCategory.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedCategory);
                }}
                className="text-gray-600 dark:text-gray-300"
              >
                Edit Category
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

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Expense Category"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField
              label="Category Name"
              name="name"
              placeholder="e.g., Healthcare"
              value={editCategory.name}
              onChange={(value) => setEditCategory({ ...editCategory, name: value })}
              required
            />
            <FormField
              label="Amount"
              name="value"
              type="number"
              placeholder="500"
              value={editCategory.value}
              onChange={(value) => setEditCategory({ ...editCategory, value: value })}
              required
            />
            <FormField
              label="Monthly Budget (Optional)"
              name="budget"
              type="number"
              placeholder="600"
              value={editCategory.budget}
              onChange={(value) => setEditCategory({ ...editCategory, budget: value })}
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about this category"
              value={editCategory.notes}
              onChange={(value) => setEditCategory({ ...editCategory, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditExpenseCategory}
            submitText="Update Category"
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </>
  );
};

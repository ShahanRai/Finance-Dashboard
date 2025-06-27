import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { useState, useContext } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, FormActions } from "@/components/ui/form-elements";
import { CurrencyContext } from "./DashboardHeader";
import { FakeDataContext } from "@/pages/Index";

interface MonthlyData {
  id: number;
  month: string;
  income: number;
  expenses: number;
  year: number;
  notes?: string;
}

const fakeMonthlyData: MonthlyData[] = [
  { id: 201, month: "Jan", income: 18000, expenses: 13200, year: 2024, notes: "Fake Jan" },
  { id: 202, month: "Feb", income: 18200, expenses: 13400, year: 2024, notes: "Fake Feb" },
  { id: 203, month: "Mar", income: 17800, expenses: 13100, year: 2024, notes: "Fake Mar" },
  { id: 204, month: "Apr", income: 18400, expenses: 13600, year: 2024, notes: "Fake Apr" },
  { id: 205, month: "May", income: 18100, expenses: 13300, year: 2024, notes: "Fake May" },
  { id: 206, month: "Jun", income: 18240, expenses: 13420, year: 2024, notes: "Fake Jun" },
];

const chartConfig = {
  income: { label: "Income", color: "#86efac" },
  expenses: { label: "Expenses", color: "#fca5a5" },
};

export const IncomeExpenseChart = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    { id: 1, month: "Jan", income: 8000, expenses: 3200, year: 2024, notes: "Started new job" },
    { id: 2, month: "Feb", income: 8200, expenses: 3400, year: 2024, notes: "Bonus month" },
    { id: 3, month: "Mar", income: 7800, expenses: 3100, year: 2024, notes: "Reduced expenses" },
    { id: 4, month: "Apr", income: 8400, expenses: 3600, year: 2024, notes: "Tax refund" },
    { id: 5, month: "May", income: 8100, expenses: 3300, year: 2024, notes: "Regular month" },
    { id: 6, month: "Jun", income: 8240, expenses: 3420, year: 2024, notes: "Summer expenses" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new month data
  const [newMonthData, setNewMonthData] = useState({
    month: "",
    income: "",
    expenses: "",
    year: new Date().getFullYear().toString(),
    notes: ""
  });

  // Form state for editing month data
  const [editMonthData, setEditMonthData] = useState({
    month: "",
    income: "",
    expenses: "",
    year: "",
    notes: ""
  });

  const monthOptions = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "Mar", label: "March" },
    { value: "Apr", label: "April" },
    { value: "May", label: "May" },
    { value: "Jun", label: "June" },
    { value: "Jul", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" }
  ];

  const { currency } = useContext(CurrencyContext);
  const { showFakeData } = useContext(FakeDataContext);
  const currencySymbol = currency === "INR" ? "\u20b9" : "$";
  const data = showFakeData ? fakeMonthlyData : monthlyData;

  const handleAddMonthData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const monthData: MonthlyData = {
        id: Date.now(),
        month: newMonthData.month,
        income: parseInt(newMonthData.income),
        expenses: parseInt(newMonthData.expenses),
        year: parseInt(newMonthData.year),
        notes: newMonthData.notes
      };

      setMonthlyData([...monthlyData, monthData]);
      setNewMonthData({
        month: "",
        income: "",
        expenses: "",
        year: new Date().getFullYear().toString(),
        notes: ""
      });
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditMonthData = () => {
    if (!selectedMonth) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updatedData = monthlyData.map(month => 
        month.id === selectedMonth.id 
          ? {
              ...month,
              month: editMonthData.month,
              income: parseInt(editMonthData.income),
              expenses: parseInt(editMonthData.expenses),
              year: parseInt(editMonthData.year),
              notes: editMonthData.notes
            }
          : month
      );
      setMonthlyData(updatedData);
      setIsEditModalOpen(false);
      setSelectedMonth(null);
      setIsLoading(false);
    }, 1000);
  };

  const deleteMonthData = (id: number) => {
    setMonthlyData(monthlyData.filter(month => month.id !== id));
  };

  const openViewModal = (month: MonthlyData) => {
    setSelectedMonth(month);
    setIsViewModalOpen(true);
  };

  const openEditModal = (month: MonthlyData) => {
    setSelectedMonth(month);
    setEditMonthData({
      month: month.month,
      income: month.income.toString(),
      expenses: month.expenses.toString(),
      year: month.year.toString(),
      notes: month.notes || ""
    });
    setIsEditModalOpen(true);
  };

  const totalIncome = data.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = data.reduce((sum, month) => sum + month.expenses, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-800 dark:text-gray-100 text-xl font-semibold flex items-center">Income vs Expenses</h3>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            variant="glass"
            className="ml-2 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Month
          </Button>
        </div>
        
        <div className="h-64 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={60}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="income" 
                  fill="#86efac" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={200}
                />
                <Bar 
                  dataKey="expenses" 
                  fill="#fca5a5" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={400}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
          {data.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between text-sm animate-fade-in group">
              <span className="text-gray-700 dark:text-gray-300">{item.month}</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-600 dark:text-emerald-400">Income: {currencySymbol}{item.income.toLocaleString()}</span>
                <span className="text-red-600 dark:text-red-400">Expenses: {currencySymbol}{item.expenses.toLocaleString()}</span>
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
                    onClick={() => deleteMonthData(item.id)}
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

      {/* Add Month Data Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Monthly Data"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField
              label="Month"
              name="month"
              placeholder="Jan"
              value={newMonthData.month}
              onChange={(value) => setNewMonthData({ ...newMonthData, month: value })}
              required
            />
            <FormField
              label="Year"
              name="year"
              type="number"
              placeholder="2024"
              value={newMonthData.year}
              onChange={(value) => setNewMonthData({ ...newMonthData, year: value })}
              required
            />
            <FormField
              label="Income"
              name="income"
              type="number"
              placeholder="8000"
              value={newMonthData.income}
              onChange={(value) => setNewMonthData({ ...newMonthData, income: value })}
              required
            />
            <FormField
              label="Expenses"
              name="expenses"
              type="number"
              placeholder="3200"
              value={newMonthData.expenses}
              onChange={(value) => setNewMonthData({ ...newMonthData, expenses: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about this month"
              value={newMonthData.notes}
              onChange={(value) => setNewMonthData({ ...newMonthData, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={handleAddMonthData}
            submitText="Add Month"
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* View Month Data Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Monthly Details"
        size="sm"
      >
        {selectedMonth && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <span className="font-bold text-lg">{selectedMonth.month}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {selectedMonth.month} {selectedMonth.year}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Monthly Financial Summary</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Income</label>
                  <p className="text-xl font-bold text-emerald-600">${selectedMonth.income.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Expenses</label>
                  <p className="text-xl font-bold text-red-600">${selectedMonth.expenses.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Savings</label>
                <p className={`text-lg font-semibold ${selectedMonth.income - selectedMonth.expenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${(selectedMonth.income - selectedMonth.expenses).toLocaleString()}
                </p>
                <div className={`text-sm mt-1 ${selectedMonth.income - selectedMonth.expenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {((selectedMonth.income - selectedMonth.expenses) / selectedMonth.income * 100).toFixed(1)}% savings rate
                </div>
              </div>
              {selectedMonth.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                  <p className="text-gray-800 dark:text-gray-100 mt-1">{selectedMonth.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedMonth);
                }}
                className="text-gray-600 dark:text-gray-300"
              >
                Edit Month
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

      {/* Edit Month Data Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Monthly Data"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField
              label="Month"
              name="month"
              placeholder="Jan"
              value={editMonthData.month}
              onChange={(value) => setEditMonthData({ ...editMonthData, month: value })}
              required
            />
            <FormField
              label="Year"
              name="year"
              type="number"
              placeholder="2024"
              value={editMonthData.year}
              onChange={(value) => setEditMonthData({ ...editMonthData, year: value })}
              required
            />
            <FormField
              label="Income"
              name="income"
              type="number"
              placeholder="8000"
              value={editMonthData.income}
              onChange={(value) => setEditMonthData({ ...editMonthData, income: value })}
              required
            />
            <FormField
              label="Expenses"
              name="expenses"
              type="number"
              placeholder="3200"
              value={editMonthData.expenses}
              onChange={(value) => setEditMonthData({ ...editMonthData, expenses: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about this month"
              value={editMonthData.notes}
              onChange={(value) => setEditMonthData({ ...editMonthData, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditMonthData}
            submitText="Update Month"
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </>
  );
};

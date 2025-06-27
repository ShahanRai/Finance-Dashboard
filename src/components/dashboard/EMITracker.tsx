import { Calendar, TrendingDown, Plus, Edit, Trash2, Eye, Calculator } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useContext } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, SelectField, FormActions } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { CurrencyContext } from "./DashboardHeader";
import { FakeDataContext } from "@/pages/Index";

interface EMI {
  id: number;
  name: string;
  monthlyAmount: number;
  remaining: number;
  total: number;
  nextDue: string;
  loanType: string;
  interestRate: number;
  startDate: string;
  lender: string;
  notes?: string;
}

const fakeEmiData: EMI[] = [
  {
    id: 101,
    name: "Fake Home Loan",
    monthlyAmount: 3850,
    remaining: 80,
    total: 120,
    nextDue: "Apr 1",
    loanType: "Home Loan",
    interestRate: 6.5,
    startDate: "2021-01-15",
    lender: "Fake Bank",
    notes: "Fake 10-year fixed rate mortgage"
  },
  {
    id: 102,
    name: "Fake Car Loan",
    monthlyAmount: 1420,
    remaining: 14,
    total: 24,
    nextDue: "Apr 5",
    loanType: "Auto Loan",
    interestRate: 8.2,
    startDate: "2023-03-01",
    lender: "Fake Lender",
    notes: "Fake 2-year auto loan"
  }
];

export const EMITracker = () => {
  const [emiData, setEmiData] = useState<EMI[]>([
    {
      id: 1,
      name: "Home Loan",
      monthlyAmount: 1850,
      remaining: 180,
      total: 240,
      nextDue: "Mar 1",
      loanType: "Home Loan",
      interestRate: 4.5,
      startDate: "2020-01-15",
      lender: "Wells Fargo",
      notes: "30-year fixed rate mortgage"
    },
    {
      id: 2,
      name: "Car Loan",
      monthlyAmount: 420,
      remaining: 24,
      total: 60,
      nextDue: "Mar 5",
      loanType: "Auto Loan",
      interestRate: 6.2,
      startDate: "2022-03-01",
      lender: "Chase Bank",
      notes: "5-year auto loan for Honda Civic"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedEMI, setSelectedEMI] = useState<EMI | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new EMI
  const [newEMI, setNewEMI] = useState({
    name: "",
    monthlyAmount: "",
    remaining: "",
    total: "",
    nextDue: "",
    loanType: "Home Loan",
    interestRate: "",
    startDate: "",
    lender: "",
    notes: ""
  });

  // Form state for editing EMI
  const [editEMI, setEditEMI] = useState({
    name: "",
    monthlyAmount: "",
    remaining: "",
    total: "",
    nextDue: "",
    loanType: "Home Loan",
    interestRate: "",
    startDate: "",
    lender: "",
    notes: ""
  });

  // EMI Calculator state
  const [calculatorData, setCalculatorData] = useState({
    principal: "",
    interestRate: "",
    tenure: "",
    tenureType: "years"
  });

  const { currency } = useContext(CurrencyContext);
  const { showFakeData } = useContext(FakeDataContext);
  const currencySymbol = currency === "INR" ? "\u20b9" : "$";
  const data = showFakeData ? fakeEmiData : emiData;

  const loanTypeOptions = [
    { value: "Home Loan", label: "Home Loan" },
    { value: "Auto Loan", label: "Auto Loan" },
    { value: "Personal Loan", label: "Personal Loan" },
    { value: "Student Loan", label: "Student Loan" },
    { value: "Business Loan", label: "Business Loan" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Other", label: "Other" }
  ];

  const tenureTypeOptions = [
    { value: "years", label: "Years" },
    { value: "months", label: "Months" }
  ];

  const handleAddEMI = () => {
    setIsLoading(true);
    setTimeout(() => {
      const emi: EMI = {
        id: Date.now(),
        name: newEMI.name,
        monthlyAmount: parseFloat(newEMI.monthlyAmount),
        remaining: parseInt(newEMI.remaining),
        total: parseInt(newEMI.total),
        nextDue: newEMI.nextDue,
        loanType: newEMI.loanType,
        interestRate: parseFloat(newEMI.interestRate),
        startDate: newEMI.startDate,
        lender: newEMI.lender,
        notes: newEMI.notes
      };

      setEmiData([...emiData, emi]);
      setNewEMI({
        name: "",
        monthlyAmount: "",
        remaining: "",
        total: "",
        nextDue: "",
        loanType: "Home Loan",
        interestRate: "",
        startDate: "",
        lender: "",
        notes: ""
      });
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditEMI = () => {
    if (!selectedEMI) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updatedEMIs = emiData.map(emi => 
        emi.id === selectedEMI.id 
          ? {
              ...emi,
              name: editEMI.name,
              monthlyAmount: parseFloat(editEMI.monthlyAmount),
              remaining: parseInt(editEMI.remaining),
              total: parseInt(editEMI.total),
              nextDue: editEMI.nextDue,
              loanType: editEMI.loanType,
              interestRate: parseFloat(editEMI.interestRate),
              startDate: editEMI.startDate,
              lender: editEMI.lender,
              notes: editEMI.notes
            }
          : emi
      );
      setEmiData(updatedEMIs);
      setIsEditModalOpen(false);
      setSelectedEMI(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteEMI = (id: number) => {
    setEmiData(emiData.filter(emi => emi.id !== id));
  };

  const openViewModal = (emi: EMI) => {
    setSelectedEMI(emi);
    setIsViewModalOpen(true);
  };

  const openEditModal = (emi: EMI) => {
    setSelectedEMI(emi);
    setEditEMI({
      name: emi.name,
      monthlyAmount: emi.monthlyAmount.toString(),
      remaining: emi.remaining.toString(),
      total: emi.total.toString(),
      nextDue: emi.nextDue,
      loanType: emi.loanType,
      interestRate: emi.interestRate.toString(),
      startDate: emi.startDate,
      lender: emi.lender,
      notes: emi.notes || ""
    });
    setIsEditModalOpen(true);
  };

  const calculateEMI = () => {
    const principal = parseFloat(calculatorData.principal);
    const rate = parseFloat(calculatorData.interestRate) / 100 / 12; // Monthly interest rate
    const tenure = calculatorData.tenureType === "years" 
      ? parseInt(calculatorData.tenure) * 12 
      : parseInt(calculatorData.tenure);

    if (principal && rate && tenure) {
      const emi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
      const totalAmount = emi * tenure;
      const totalInterest = totalAmount - principal;

      alert(`EMI Calculation Results:\nMonthly EMI: ${currencySymbol}${emi.toFixed(2)}\nTotal Amount: ${currencySymbol}${totalAmount.toFixed(2)}\nTotal Interest: ${currencySymbol}${totalInterest.toFixed(2)}\nPrincipal Amount: ${currencySymbol}${principal.toFixed(2)}`);
    }
  };

  const totalMonthlyEMI = data.reduce((sum, emi) => sum + emi.monthlyAmount, 0);
  const totalRemainingPayments = data.reduce((sum, emi) => sum + emi.remaining, 0);
  const totalLoanAmount = data.reduce((sum, emi) => sum + (emi.monthlyAmount * emi.total), 0);
  const totalPaid = totalLoanAmount - data.reduce((sum, emi) => sum + (emi.monthlyAmount * emi.remaining), 0);

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-800 dark:text-gray-100 text-xl font-semibold flex items-center">EMI Tracker</h3>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsCalculatorOpen(true)}
              size="icon"
              variant="glass"
              className="ml-2 flex items-center justify-center"
              title="Calculator"
            >
              <Calculator className="h-5 w-5" />
            </Button>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              variant="glass"
              className="ml-2 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              EMI
            </Button>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-800/30 border border-orange-200 dark:border-orange-700/30">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Monthly EMI</div>
          <div className="text-gray-800 dark:text-gray-100 text-2xl font-bold">{currencySymbol}{totalMonthlyEMI.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {data.length} active loans • {totalRemainingPayments} payments remaining
          </div>
        </div>
        
        <div className="space-y-6">
          {data.map((emi, index) => (
            <div key={emi.id} className="space-y-3 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="text-gray-800 dark:text-gray-100 font-medium">{emi.name}</h4>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{currencySymbol}{emi.monthlyAmount}/mo</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openViewModal(emi)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(emi)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEMI(emi.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {emi.total - emi.remaining}/{emi.total} months
                  </span>
                </div>
                <Progress 
                  value={((emi.total - emi.remaining) / emi.total) * 100}
                  className="h-2 bg-gray-200/50 dark:bg-gray-700/50"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Next due: {emi.nextDue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add EMI Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New EMI"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Loan Name"
              name="name"
              placeholder="e.g., Home Loan"
              value={newEMI.name}
              onChange={(value) => setNewEMI({ ...newEMI, name: value })}
              required
            />
            <SelectField
              label="Loan Type"
              name="loanType"
              value={newEMI.loanType}
              onValueChange={(value) => setNewEMI({ ...newEMI, loanType: value })}
              options={loanTypeOptions}
              required
            />
            <FormField
              label="Monthly EMI Amount"
              name="monthlyAmount"
              type="number"
              placeholder="1850"
              value={newEMI.monthlyAmount}
              onChange={(value) => setNewEMI({ ...newEMI, monthlyAmount: value })}
              required
            />
            <FormField
              label="Interest Rate (%)"
              name="interestRate"
              type="number"
              placeholder="4.5"
              value={newEMI.interestRate}
              onChange={(value) => setNewEMI({ ...newEMI, interestRate: value })}
              required
            />
            <FormField
              label="Total Tenure (months)"
              name="total"
              type="number"
              placeholder="240"
              value={newEMI.total}
              onChange={(value) => setNewEMI({ ...newEMI, total: value })}
              required
            />
            <FormField
              label="Remaining Payments"
              name="remaining"
              type="number"
              placeholder="180"
              value={newEMI.remaining}
              onChange={(value) => setNewEMI({ ...newEMI, remaining: value })}
              required
            />
            <FormField
              label="Next Due Date"
              name="nextDue"
              placeholder="Mar 1"
              value={newEMI.nextDue}
              onChange={(value) => setNewEMI({ ...newEMI, nextDue: value })}
              required
            />
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={newEMI.startDate}
              onChange={(value) => setNewEMI({ ...newEMI, startDate: value })}
              required
            />
            <FormField
              label="Lender/Bank"
              name="lender"
              placeholder="Wells Fargo"
              value={newEMI.lender}
              onChange={(value) => setNewEMI({ ...newEMI, lender: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about the loan"
              value={newEMI.notes}
              onChange={(value) => setNewEMI({ ...newEMI, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={handleAddEMI}
            submitText="Add EMI"
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* View EMI Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="EMI Details"
        size="md"
      >
        {selectedEMI && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center text-white">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {selectedEMI.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedEMI.loanType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly EMI</label>
                <p className="text-xl font-bold text-red-600">{currencySymbol}{selectedEMI.monthlyAmount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Interest Rate</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedEMI.interestRate}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</label>
                <p className="text-gray-800 dark:text-gray-100">
                  {selectedEMI.total - selectedEMI.remaining}/{selectedEMI.total} months
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Due</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedEMI.nextDue}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Lender</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedEMI.lender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedEMI.startDate}</p>
              </div>
            </div>

            {selectedEMI.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                <p className="text-gray-800 dark:text-gray-100 mt-1">{selectedEMI.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedEMI);
                }}
                className="text-gray-600 dark:text-gray-300"
              >
                Edit EMI
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

      {/* Edit EMI Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit EMI"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Loan Name"
              name="name"
              placeholder="e.g., Home Loan"
              value={editEMI.name}
              onChange={(value) => setEditEMI({ ...editEMI, name: value })}
              required
            />
            <SelectField
              label="Loan Type"
              name="loanType"
              value={editEMI.loanType}
              onValueChange={(value) => setEditEMI({ ...editEMI, loanType: value })}
              options={loanTypeOptions}
              required
            />
            <FormField
              label="Monthly EMI Amount"
              name="monthlyAmount"
              type="number"
              placeholder="1850"
              value={editEMI.monthlyAmount}
              onChange={(value) => setEditEMI({ ...editEMI, monthlyAmount: value })}
              required
            />
            <FormField
              label="Interest Rate (%)"
              name="interestRate"
              type="number"
              placeholder="4.5"
              value={editEMI.interestRate}
              onChange={(value) => setEditEMI({ ...editEMI, interestRate: value })}
              required
            />
            <FormField
              label="Total Tenure (months)"
              name="total"
              type="number"
              placeholder="240"
              value={editEMI.total}
              onChange={(value) => setEditEMI({ ...editEMI, total: value })}
              required
            />
            <FormField
              label="Remaining Payments"
              name="remaining"
              type="number"
              placeholder="180"
              value={editEMI.remaining}
              onChange={(value) => setEditEMI({ ...editEMI, remaining: value })}
              required
            />
            <FormField
              label="Next Due Date"
              name="nextDue"
              placeholder="Mar 1"
              value={editEMI.nextDue}
              onChange={(value) => setEditEMI({ ...editEMI, nextDue: value })}
              required
            />
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={editEMI.startDate}
              onChange={(value) => setEditEMI({ ...editEMI, startDate: value })}
              required
            />
            <FormField
              label="Lender/Bank"
              name="lender"
              placeholder="Wells Fargo"
              value={editEMI.lender}
              onChange={(value) => setEditEMI({ ...editEMI, lender: value })}
              required
            />
            <FormField
              label="Notes (Optional)"
              name="notes"
              placeholder="Additional notes about the loan"
              value={editEMI.notes}
              onChange={(value) => setEditEMI({ ...editEMI, notes: value })}
            />
          </div>

          <FormActions
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditEMI}
            submitText="Update EMI"
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* EMI Calculator Modal */}
      <Modal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="EMI Calculator"
        size="md"
      >
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Calculate Your EMI</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter loan details to calculate monthly EMI, total interest, and total amount.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              label="Principal Amount"
              name="principal"
              type="number"
              placeholder="100000"
              value={calculatorData.principal}
              onChange={(value) => setCalculatorData({ ...calculatorData, principal: value })}
              required
            />
            <FormField
              label="Interest Rate (%)"
              name="interestRate"
              type="number"
              placeholder="8.5"
              value={calculatorData.interestRate}
              onChange={(value) => setCalculatorData({ ...calculatorData, interestRate: value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Tenure"
                name="tenure"
                type="number"
                placeholder="5"
                value={calculatorData.tenure}
                onChange={(value) => setCalculatorData({ ...calculatorData, tenure: value })}
                required
              />
              <SelectField
                label="Tenure Type"
                name="tenureType"
                value={calculatorData.tenureType}
                onValueChange={(value) => setCalculatorData({ ...calculatorData, tenureType: value })}
                options={tenureTypeOptions}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <Button
              variant="outline"
              onClick={() => setIsCalculatorOpen(false)}
              className="text-gray-600 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={calculateEMI}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Calculate EMI
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

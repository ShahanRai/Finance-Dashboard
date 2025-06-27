import { CreditCard as LucideCreditCard, MoreHorizontal, Plus, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useContext, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, SelectField, FormActions } from "@/components/ui/form-elements";
import { CurrencyContext } from "./DashboardHeader";
import { FakeDataContext } from "@/pages/Index";

interface CreditCard {
  id: number;
  name: string;
  bank: string;
  last4: string;
  balance: number;
  limit: number;
  dueDate: string;
  gradient: string;
  logo: string; // URL to bank logo
  cardType: string;
  expiryDate: string;
}

// Supported banks with logo URLs (add your own SVG/PNG in /public/banks/ for best reliability)
const supportedBanks = [
  { name: "State Bank of India (SBI)", logo: "/banks/sbi.png" },
  { name: "HDFC Bank", logo: "/banks/hdfc.png" },
  { name: "ICICI Bank", logo: "/banks/icici.png" },
  { name: "Axis Bank", logo: "/banks/axis.png" },
  { name: "Kotak Mahindra Bank", logo: "/banks/kotak.png" },
  { name: "IndusInd Bank", logo: "/banks/indusind.png" },
  { name: "Yes Bank", logo: "/banks/yes.png" },
  { name: "IDFC FIRST Bank", logo: "/banks/idfc.png" },
  { name: "Federal Bank", logo: "/banks/federal.png" },
  { name: "HSBC", logo: "/banks/hsbc.png" },
  { name: "Standard Chartered Bank", logo: "/banks/standardchartered.png" },
  { name: "AU Small Finance Bank", logo: "/banks/au.png" },
  { name: "One Card", logo: "/banks/onecard.png" },
];

// Helper to get logo from supportedBanks
const getSupportedBankLogo = (bankName: string) => {
  const bank = supportedBanks.find(b => b.name === bankName);
  return bank ? bank.logo : undefined;
};

// Helper to get SVG logo path for a bank
const getBankSvgLogo = (bankName: string) => {
  if (!bankName) return undefined;
  const fileName = bankName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `/banks/${fileName}.svg`;
};

const fakeCreditCards = [
  {
    id: 101,
    name: "Fake Sapphire",
    bank: "State Bank of India (SBI)",
    last4: "1111",
    balance: 750,
    limit: 1000,
    dueDate: "Jul 15",
    gradient: "from-green-400 via-green-500 to-green-600",
    logo: getSupportedBankLogo("State Bank of India (SBI)"),
    cardType: "Visa",
    expiryDate: "12/29"
  },
  {
    id: 102,
    name: "Fake Platinum",
    bank: "HDFC Bank",
    last4: "2222",
    balance: 1200,
    limit: 2000,
    dueDate: "Aug 10",
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    logo: getSupportedBankLogo("HDFC Bank"),
    cardType: "Mastercard",
    expiryDate: "11/28"
  },
  {
    id: 103,
    name: "Fake Rewards",
    bank: "ICICI Bank",
    last4: "3333",
    balance: 500,
    limit: 1500,
    dueDate: "Sep 5",
    gradient: "from-yellow-400 via-yellow-500 to-yellow-600",
    logo: getSupportedBankLogo("ICICI Bank"),
    cardType: "Discover",
    expiryDate: "10/27"
  }
];

function CreditCardTab({ card, isActive, onClick, tabRef }) {
  return (
    <button
      ref={tabRef}
      className={`w-32 px-0 py-2 rounded-t-lg border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none flex items-center justify-center ${isActive ? 'bg-white dark:bg-gray-900 border-blue-500 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      style={{ minWidth: 128, maxWidth: 128, marginRight: 4 }}
      onClick={onClick}
      aria-selected={isActive}
      tabIndex={0}
    >
      <span className="truncate w-full text-center">{card.name}</span>
    </button>
  );
}

function CreditCardItem({ card, currencySymbol, onView, onEdit, onDelete }) {
  const utilization = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
  const svgLogo = getBankSvgLogo(card.bank);
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${card.gradient} shadow-lg transition-all duration-300 group`}>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/90 font-bold text-lg flex items-center gap-2">
          {svgLogo && (
            <img
              src={svgLogo}
              alt="logo"
              /*card view height and width*/
              className="max-w-[90px] max-h-[70px] rounded w-auto h-auto mr-2 bg-white object-contain"
              style={{display: 'block'}}
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/banks/custom-bank.svg'; }}
            />
          )}
          <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded mr-2">{card.bank}</span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button onClick={onView} variant="ghost" size="icon" className="text-white/80 hover:bg-white/20 h-8 w-8"><Eye className="h-4 w-4" /></Button>
          <Button onClick={onEdit} variant="ghost" size="icon" className="text-white/80 hover:bg-white/20 h-8 w-8"><Edit className="h-4 w-4" /></Button>
          <Button onClick={onDelete} variant="ghost" size="icon" className="text-white/80 hover:bg-white/20 h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
      {/* Card Number */}
      <div className="text-white/90 text-lg font-mono mb-4 tracking-wider">•••• •••• •••• {card.last4}</div>
      {/* Card Details */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="text-white/70 text-xs uppercase tracking-wide mb-1">Card Holder</div>
          <div className="text-white font-medium">{card.name}</div>
        </div>
        <div className="text-right">
          <div className="text-white/70 text-xs uppercase tracking-wide mb-1">Expires</div>
          <div className="text-white font-medium">{card.expiryDate}</div>
        </div>
      </div>
      {/* Usage Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/80">
          <span>Used: {currencySymbol}{card.balance.toLocaleString()}</span>
          <span>Limit: {currencySymbol}{card.limit.toLocaleString()}</span>
        </div>
        <Progress value={utilization} className="h-2 bg-white/20" />
        <div className="flex items-center gap-2 mt-1 justify-between">
          <span className="text-white/70 text-xs">Due: {card.dueDate}</span>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${utilization > 80 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : utilization > 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}
            style={{ minWidth: 90, textAlign: 'center' }}>
            {utilization.toFixed(1)}% Utilized
          </span>
        </div>
      </div>
      {/* Card Brand Pattern */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full"></div>
    </div>
  );
}

export const CreditCardsList = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    {
      id: 1,
      name: "Chase Sapphire",
      bank: "Chase",
      last4: "4532",
      balance: 1250,
      limit: 5000,
      dueDate: "Mar 15",
      gradient: "from-blue-600 via-blue-700 to-blue-800",
      logo: "CHASE",
      cardType: "Visa",
      expiryDate: "12/27"
    },
    {
      id: 2,
      name: "Amex Platinum",
      bank: "American Express",
      last4: "3421",
      balance: 2800,
      limit: 10000,
      dueDate: "Mar 20",
      gradient: "from-gray-400 via-gray-500 to-gray-600",
      logo: "AMEX",
      cardType: "American Express",
      expiryDate: "08/26"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new card
  const [newCard, setNewCard] = useState({
    name: "",
    bank: "",
    last4: "",
    limit: "",
    balance: "",
    dueDate: "",
    cardType: "Visa",
    expiryDate: "",
  });

  // Form state for editing card
  const [editCard, setEditCard] = useState({
    name: "",
    bank: "",
    last4: "",
    limit: "",
    balance: "",
    dueDate: "",
    cardType: "Visa",
    expiryDate: "",
  });

  const { currency } = useContext(CurrencyContext);
  const { showFakeData } = useContext(FakeDataContext);
  const currencySymbol = currency === "INR" ? "\u20b9" : "$";
  const cards = showFakeData ? fakeCreditCards : creditCards;

  const gradients = [
    "from-purple-600 via-purple-700 to-purple-800",
    "from-green-600 via-green-700 to-green-800",
    "from-red-600 via-red-700 to-red-800",
    "from-indigo-600 via-indigo-700 to-indigo-800",
    "from-pink-600 via-pink-700 to-pink-800",
    "from-yellow-600 via-yellow-700 to-yellow-800"
  ];

  const cardTypeOptions = [
    { value: "Visa", label: "Visa" },
    { value: "Mastercard", label: "Mastercard" },
    { value: "American Express", label: "American Express" },
    { value: "Discover", label: "Discover" }
  ];

  const handleAddCreditCard = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      const card: CreditCard = {
        id: Date.now(),
        name: newCard.name,
        bank: newCard.bank,
        last4: newCard.last4,
        balance: parseInt(newCard.balance),
        limit: parseInt(newCard.limit),
        dueDate: newCard.dueDate,
        gradient: randomGradient,
        logo: getSupportedBankLogo(newCard.bank) || newCard.bank.toUpperCase().slice(0, 4),
        cardType: newCard.cardType,
        expiryDate: newCard.expiryDate,
      };

      setCreditCards([...creditCards, card]);
      setNewCard({
        name: "",
        bank: "",
        last4: "",
        limit: "",
        balance: "",
        dueDate: "",
        cardType: "Visa",
        expiryDate: "",
      });
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditCreditCard = () => {
    if (!selectedCard) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updatedCards = creditCards.map(card => 
        card.id === selectedCard.id 
          ? {
              ...card,
              name: editCard.name,
              bank: editCard.bank,
              last4: editCard.last4,
              balance: parseInt(editCard.balance),
              limit: parseInt(editCard.limit),
              dueDate: editCard.dueDate,
              logo: getSupportedBankLogo(editCard.bank) || editCard.bank.toUpperCase().slice(0, 4),
              cardType: editCard.cardType,
              expiryDate: editCard.expiryDate,
            }
          : card
      );
      setCreditCards(updatedCards);
      setIsEditModalOpen(false);
      setSelectedCard(null);
      setIsLoading(false);
    }, 1000);
  };

  const deleteCreditCard = (id: number) => {
    setCreditCards(creditCards.filter(card => card.id !== id));
  };

  const openViewModal = (card: CreditCard) => {
    setSelectedCard(card);
    setIsViewModalOpen(true);
  };

  const openEditModal = (card: CreditCard) => {
    setSelectedCard(card);
    setEditCard({
      name: card.name,
      bank: card.bank,
      last4: card.last4,
      limit: card.limit.toString(),
      balance: card.balance.toString(),
      dueDate: card.dueDate,
      cardType: card.cardType,
      expiryDate: card.expiryDate,
    });
    setIsEditModalOpen(true);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const totalCreditUsed = cards.reduce((sum, card) => sum + card.balance, 0);
  const totalCreditLimit = cards.reduce((sum, card) => sum + card.limit, 0);
  const creditUtilization = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0;

  // Navigation handlers
  const goLeft = () => setActiveIndex(i => Math.max(0, i - 1));
  const goRight = () => setActiveIndex(i => Math.min(cards.length - 1, i + 1));

  // Tab scroll logic
  const tabBarRef = useRef(null);
  const tabRefs = useRef([]);
  useEffect(() => {
    if (tabRefs.current[activeIndex]) {
      tabRefs.current[activeIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex, cards.length]);

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-800 dark:text-gray-100 text-xl font-semibold flex items-center">Credit Cards</h3>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" variant="glass" className="ml-2 flex items-center gap-1">
            <Plus className="h-4 w-4" /> Card
          </Button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-700 dark:text-gray-300">Used: <span className="font-bold">{currencySymbol}{totalCreditUsed.toLocaleString()}</span></span>
          <span className="text-gray-700 dark:text-gray-300">Limit: <span className="font-bold">{currencySymbol}{totalCreditLimit.toLocaleString()}</span></span>
          <span className="flex-1 flex justify-end">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${creditUtilization > 80 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : creditUtilization > 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}
              style={{ minWidth: 90, textAlign: 'center', marginLeft: 24 }}>
              {creditUtilization.toFixed(1)}% Utilized
            </span>
          </span>
        </div>
        {/* Tab bar for stacked cards with chevrons and scroll */}
        {cards.length > 1 && (
          <div className="flex flex-row items-center mb-4">
            <button onClick={goLeft} disabled={activeIndex === 0} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 flex items-center justify-center"><ChevronLeft className="h-5 w-5" /></button>
            <div className="flex flex-row items-center overflow-hidden" ref={tabBarRef} style={{ flex: 1 }}>
              {cards.map((card, idx) => (
                <CreditCardTab
                  key={card.id}
                  card={card}
                  isActive={activeIndex === idx}
                  onClick={() => setActiveIndex(idx)}
                  tabRef={el => tabRefs.current[idx] = el}
                />
              ))}
            </div>
            <button onClick={goRight} disabled={activeIndex === cards.length - 1} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 flex items-center justify-center"><ChevronRight className="h-5 w-5" /></button>
          </div>
        )}
        {/* Selected card */}
        {cards.length > 0 && (
          <div className="w-full">
            <CreditCardItem
              card={cards[activeIndex]}
              currencySymbol={currencySymbol}
              onView={() => openViewModal(cards[activeIndex])}
              onEdit={() => openEditModal(cards[activeIndex])}
              onDelete={() => deleteCreditCard(cards[activeIndex].id)}
            />
          </div>
        )}
      </div>

      {/* Add Credit Card Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Credit Card"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Card Name"
              name="name"
              placeholder="e.g., Chase Sapphire"
              value={newCard.name}
              onChange={(value) => setNewCard({ ...newCard, name: value })}
              required
            />
            <SelectField
              label="Bank Name"
              name="bank"
              value={newCard.bank}
              onValueChange={(value) => setNewCard({ ...newCard, bank: value })}
              options={supportedBanks.map(b => ({ value: b.name, label: b.name }))}
              required
            />
            <FormField
              label="Last 4 Digits"
              name="last4"
              placeholder="1234"
              value={newCard.last4}
              onChange={(value) => setNewCard({ ...newCard, last4: value })}
              required
            />
            <SelectField
              label="Card Type"
              name="cardType"
              value={newCard.cardType}
              onValueChange={(value) => setNewCard({ ...newCard, cardType: value })}
              options={cardTypeOptions}
              required
            />
            <FormField
              label="Credit Limit"
              name="limit"
              type="number"
              placeholder="5000"
              value={newCard.limit}
              onChange={(value) => setNewCard({ ...newCard, limit: value })}
              required
            />
            <FormField
              label="Current Balance"
              name="balance"
              type="number"
              placeholder="1250"
              value={newCard.balance}
              onChange={(value) => setNewCard({ ...newCard, balance: value })}
              required
            />
            <FormField
              label="Due Date"
              name="dueDate"
              placeholder="Mar 15"
              value={newCard.dueDate}
              onChange={(value) => setNewCard({ ...newCard, dueDate: value })}
              required
            />
            <FormField
              label="Expiry Date"
              name="expiryDate"
              placeholder="12/27"
              value={newCard.expiryDate}
              onChange={(value) => setNewCard({ ...newCard, expiryDate: value })}
              required
            />
          </div>

          <FormActions
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={handleAddCreditCard}
            submitText="Add Credit Card"
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* View Credit Card Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Credit Card Details"
        size="md"
      >
        {selectedCard && (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl bg-gradient-to-r ${selectedCard.gradient} text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg flex items-center gap-2">
                  {getBankSvgLogo(selectedCard.bank) && (
                    <img
                      src={getBankSvgLogo(selectedCard.bank)}
                      alt="logo"
                      /*card view height and width*/
                      className="max-w-[90px] max-h-[70px] rounded w-auto h-auto mr-2 bg-white object-contain"
                      style={{display: 'block'}}
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/banks/custom-bank.svg'; }}
                    />
                  )}
                </div>
                <div className="text-white/70 text-sm">{selectedCard.cardType}</div>
              </div>
              <div className="text-lg font-mono mb-4 tracking-wider">
                •••• •••• •••• {selectedCard.last4}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-white/70 text-xs uppercase tracking-wide mb-1">Card Holder</div>
                  <div className="font-medium">{selectedCard.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/70 text-xs uppercase tracking-wide mb-1">Expires</div>
                  <div className="font-medium">{selectedCard.expiryDate}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Bank</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedCard.bank}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Card Type</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedCard.cardType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</label>
                <p className="text-red-600 font-semibold">${selectedCard.balance.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Credit Limit</label>
                <p className="text-gray-800 dark:text-gray-100">${selectedCard.limit.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedCard.dueDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization</label>
                <p className={`font-semibold ${(selectedCard.balance / selectedCard.limit) * 100 > 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {((selectedCard.balance / selectedCard.limit) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedCard);
                }}
                className="text-gray-600 dark:text-gray-300"
              >
                Edit Card
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

      {/* Edit Credit Card Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Credit Card"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Card Name"
              name="name"
              placeholder="e.g., Chase Sapphire"
              value={editCard.name}
              onChange={(value) => setEditCard({ ...editCard, name: value })}
              required
            />
            <SelectField
              label="Bank Name"
              name="bank"
              value={editCard.bank}
              onValueChange={(value) => setEditCard({ ...editCard, bank: value })}
              options={supportedBanks.map(b => ({ value: b.name, label: b.name }))}
              required
            />
            <FormField
              label="Last 4 Digits"
              name="last4"
              placeholder="1234"
              value={editCard.last4}
              onChange={(value) => setEditCard({ ...editCard, last4: value })}
              required
            />
            <SelectField
              label="Card Type"
              name="cardType"
              value={editCard.cardType}
              onValueChange={(value) => setEditCard({ ...editCard, cardType: value })}
              options={cardTypeOptions}
              required
            />
            <FormField
              label="Credit Limit"
              name="limit"
              type="number"
              placeholder="5000"
              value={editCard.limit}
              onChange={(value) => setEditCard({ ...editCard, limit: value })}
              required
            />
            <FormField
              label="Current Balance"
              name="balance"
              type="number"
              placeholder="1250"
              value={editCard.balance}
              onChange={(value) => setEditCard({ ...editCard, balance: value })}
              required
            />
            <FormField
              label="Due Date"
              name="dueDate"
              placeholder="Mar 15"
              value={editCard.dueDate}
              onChange={(value) => setEditCard({ ...editCard, dueDate: value })}
              required
            />
            <FormField
              label="Expiry Date"
              name="expiryDate"
              placeholder="12/27"
              value={editCard.expiryDate}
              onChange={(value) => setEditCard({ ...editCard, expiryDate: value })}
              required
            />
          </div>

          <FormActions
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditCreditCard}
            submitText="Update Credit Card"
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </>
  );
};

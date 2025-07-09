import React from 'react';
import { ProfileModal } from './ProfileModal';
import { TransactionModal } from './TransactionModal';
import { CreditCardModal } from './CreditCardModal';
import { WishModal } from './WishModal';

interface DashboardModalsProps {
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  transactionModalOpen: boolean;
  setTransactionModalOpen: (open: boolean) => void;
  transactionType: 'income' | 'expense' | 'investment' | 'emi';
  creditCardModalOpen: boolean;
  setCreditCardModalOpen: (open: boolean) => void;
  editingCard: any;
  wishModalOpen: boolean;
  setWishModalOpen: (open: boolean) => void;
  editingWish: any;
  onDataCleared?: () => void;
  onDataChanged?: () => void;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  profileModalOpen,
  setProfileModalOpen,
  transactionModalOpen,
  setTransactionModalOpen,
  transactionType,
  creditCardModalOpen,
  setCreditCardModalOpen,
  editingCard,
  wishModalOpen,
  setWishModalOpen,
  editingWish,
  onDataCleared,
  onDataChanged
}) => {
  return (
    <>
      <ProfileModal 
        open={profileModalOpen} 
        onOpenChange={setProfileModalOpen}
        onDataCleared={onDataCleared}
      />
      <TransactionModal 
        open={transactionModalOpen} 
        onOpenChange={setTransactionModalOpen}
        type={transactionType}
        onDataChanged={onDataChanged}
      />
      <CreditCardModal 
        open={creditCardModalOpen} 
        onOpenChange={setCreditCardModalOpen}
        editCard={editingCard}
        onDataChanged={onDataChanged}
      />
      <WishModal 
        open={wishModalOpen} 
        onOpenChange={setWishModalOpen}
        editWish={editingWish}
        onDataChanged={onDataChanged}
      />
    </>
  );
};

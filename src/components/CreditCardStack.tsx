import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// --- SHARED CONSTANTS ---
// Moved outside the component to be accessible by both CreditCardComponent and CreditCardStack
const CARD_HEIGHT = 224; // h-56 in px
const VISIBLE_STRIP_PERCENT = 0.25; // Increased from 0.1 to 0.25 (25%) for better visibility and clickability

interface CreditCardProps {
  id: string;
  card_name: string;
  card_number: string;
  card_type: string;
  credit_limit: number;
  current_balance: number;
  color_theme: string;
  due_date: string;
  index: number;
  total: number;
  onCardClick: (card: any) => void;
  getCurrencySymbol: () => string;
  isFrontCard: boolean;
  onCardRotate: (cardId: string) => void;
}

const CreditCardComponent: React.FC<CreditCardProps> = ({
  id,
  card_name,
  card_number,
  card_type,
  credit_limit,
  current_balance,
  color_theme,
  due_date,
  index,
  total,
  onCardClick,
  getCurrencySymbol,
  isFrontCard,
  onCardRotate,
}) => {
  const cardData = {
    id, card_name, card_number, card_type,
    credit_limit, current_balance, color_theme, due_date
  };
  const safeColorTheme = color_theme && /^#[0-9A-Fa-f]{6}$/.test(color_theme) ? color_theme : '#6366f1';
  const usagePercentage = (current_balance / credit_limit) * 100;

  const distanceFromFront = total - 1 - index;

  return (
    <motion.div
      className="absolute left-0 w-full cursor-pointer"
      style={{
        zIndex: index,
        height: `${CARD_HEIGHT}px`,
        originX: 0.5,
        originY: 1,
        willChange: 'transform',
      }}
      animate={{
        bottom: `${index * CARD_HEIGHT * VISIBLE_STRIP_PERCENT}px`,
        scale: 1 - distanceFromFront * 0.05,
        y: distanceFromFront * -10,
        rotateY: 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={() => {
        if (!isFrontCard) {
          onCardRotate(id);
        } else {
          onCardClick(cardData);
        }
      }}
    >
      <div
        className="w-full h-full rounded-2xl shadow-2xl relative"
        style={{
          background: `linear-gradient(135deg, ${safeColorTheme} 0%, #232526 100%)`,
          boxShadow: isFrontCard ? '0 8px 32px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.10)',
          transition: 'box-shadow 0.3s',
          // The overflow is handled by the parent container of the stack now
        }}
      >
        {/* Shine overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 30%, transparent 70%)',
            mixBlendMode: 'screen'
          }}
        />

        {/* --- KEY CHANGE HERE --- */}
        {/* We now use separate content structures for the front card vs. stacked cards */}
        {/* This prevents layout conflicts and ensures the stacked card info is visible. */}
        {isFrontCard ? (
          // FULL CONTENT FOR THE FRONT CARD
          <div className="relative p-6 h-full flex flex-col justify-between text-white z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #e0c068 60%, #fffbe6 100%)' }} />
                <div>
                  <p className="text-xs opacity-90 uppercase tracking-wider font-semibold">{card_type}</p>
                  <p className="text-sm font-medium opacity-90 mt-1">{card_name}</p>
                </div>
              </div>
              <div className="w-12 h-8 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col items-center mt-4 w-full">
              <div className="font-mono text-2xl tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                {card_number.replace(/(.{4})/g, '$1 ').trim()}
              </div>
              <Progress value={usagePercentage} className="h-2 mt-3 w-full bg-white/30 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
              <div className="flex justify-between w-full mt-1">
                <span className="text-xs font-semibold">{usagePercentage.toFixed(0)}% Used</span>
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs opacity-75">Used</p>
                <p className="text-sm font-semibold">{getCurrencySymbol()}{current_balance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Available</p>
                <p className="text-sm font-semibold">{getCurrencySymbol()}{(credit_limit - current_balance).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          // MINIMAL, VISIBLE CONTENT FOR STACKED CARDS
          <div
            className="absolute left-0 w-full z-20 flex flex-col items-start justify-start px-4 pt-2"
            style={{
              height: `${CARD_HEIGHT * VISIBLE_STRIP_PERCENT}px`,
              minHeight: `${CARD_HEIGHT * VISIBLE_STRIP_PERCENT}px`,
              maxHeight: `${CARD_HEIGHT * VISIBLE_STRIP_PERCENT}px`,
              top: 0,
              pointerEvents: 'none',
            }}
          >
            {/* Overlay for contrast */}
            <div
              className="absolute left-0 top-0 w-full h-full rounded-t-2xl"
              style={{
                background: 'rgba(0,0,0,0.35)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            <div className="relative z-10 w-full">
              <span className="block text-sm font-semibold text-white text-left w-full truncate" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 0 #000'}}>{card_name}</span>
              <span className="block text-xs font-medium uppercase tracking-wider text-white/90 text-left w-full truncate" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 0 #000'}}>{card_type}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface CreditCardStackProps {
  cards: any[];
  onCardClick: (card: any) => void;
  onAddCard: () => void;
  getCurrencySymbol: () => string;
}

export const CreditCardStack: React.FC<CreditCardStackProps> = ({
  cards,
  onCardClick,
  onAddCard,
  getCurrencySymbol
}) => {
  const [frontCardId, setFrontCardId] = useState<string | null>(cards.length > 0 ? cards[0]?.id : null);

  React.useEffect(() => {
    if (cards.length > 0 && (!frontCardId || !cards.some(c => c.id === frontCardId))) {
      setFrontCardId(cards[0].id);
    }
  }, [cards, frontCardId]);

  const orderedCards = React.useMemo(() => {
    if (!frontCardId) return cards;
    
    const frontCardIndex = cards.findIndex(card => card.id === frontCardId);
    if (frontCardIndex === -1) return cards;
    
    const frontCard = cards[frontCardIndex];
    const otherCards = cards.filter(card => card.id !== frontCardId);

    // Reorder logic to place the front card at the end of the array (highest index)
    const after = cards.slice(frontCardIndex + 1);
    const before = cards.slice(0, frontCardIndex);
    
    return [...after, ...before, frontCard];

  }, [cards, frontCardId]);

  const handleCardRotate = (cardId: string) => {
    setFrontCardId(cardId);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
        >
          <CreditCard className="h-8 w-8 text-white" />
        </motion.div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">No credit cards added yet</p>
        <Button onClick={onAddCard} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Card
        </Button>
      </div>
    );
  }

  // The stack container height calculation now uses the updated constant
  const stackHeight = CARD_HEIGHT + (cards.length - 1) * CARD_HEIGHT * VISIBLE_STRIP_PERCENT;

  return (
    <div className="space-y-4">
      <div className="relative w-full" style={{ height: stackHeight }}>
        {orderedCards.map((card, i) => (
          <CreditCardComponent
            key={card.id}
            {...card}
            index={i}
            total={cards.length}
            onCardClick={onCardClick}
            getCurrencySymbol={getCurrencySymbol}
            isFrontCard={i === orderedCards.length - 1}
            onCardRotate={handleCardRotate}
          />
        ))}
      </div>
      <Button onClick={onAddCard} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add New Card
      </Button>
    </div>
  );
};
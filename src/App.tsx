/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Card } from './lib/pokerLogic';
import { CardSlot } from './components/CardSlot';
import { CardSelectorPanel } from './components/CardSelectorPanel';
import { OddsPanel } from './components/OddsPanel';
import { RotateCcw } from 'lucide-react';

type SlotRef = { type: 'hole' | 'community', index: number };

export default function App() {
  const [holeCards, setHoleCards] = useState<(Card | null)[]>([null, null]);
  const [communityCards, setCommunityCards] = useState<(Card | null)[]>([null, null, null, null, null]);
  
  const [activeSlot, setActiveSlot] = useState<SlotRef | null>({ type: 'hole', index: 0 });

  // Auto-advance active slot when cards change
  useEffect(() => {
    // Find first empty hole card
    const emptyHoleIdx = holeCards.findIndex(c => c === null);
    if (emptyHoleIdx !== -1) {
      setActiveSlot({ type: 'hole', index: emptyHoleIdx });
      return;
    }
    // Find first empty community card
    const emptyCommIdx = communityCards.findIndex(c => c === null);
    if (emptyCommIdx !== -1) {
      setActiveSlot({ type: 'community', index: emptyCommIdx });
      return;
    }
    // If all full, clear active slot
    setActiveSlot(null);
  }, [holeCards, communityCards]);

  const handleReset = () => {
    setHoleCards([null, null]);
    setCommunityCards([null, null, null, null, null]);
    setActiveSlot({ type: 'hole', index: 0 });
  };

  const usedCardIds = new Set<string>();
  holeCards.forEach(c => c && usedCardIds.add(c.id));
  communityCards.forEach(c => c && usedCardIds.add(c.id));

  const handleSelectCard = (card: Card) => {
    if (!activeSlot) return;
    
    if (activeSlot.type === 'hole') {
      const newCards = [...holeCards];
      newCards[activeSlot.index] = card;
      setHoleCards(newCards);
    } else {
      const newCards = [...communityCards];
      newCards[activeSlot.index] = card;
      setCommunityCards(newCards);
    }
  };

  const handleSlotClick = (type: 'hole' | 'community', index: number) => {
    const isHole = type === 'hole';
    const currentCard = isHole ? holeCards[index] : communityCards[index];
    
    if (currentCard) {
      // If clicking a filled slot, clear it and make it active
      if (isHole) {
        const newCards = [...holeCards];
        newCards[index] = null;
        setHoleCards(newCards);
      } else {
        const newCards = [...communityCards];
        newCards[index] = null;
        setCommunityCards(newCards);
      }
    }
    
    setActiveSlot({ type, index });
  };

  const isSlotActive = (type: 'hole' | 'community', index: number) => {
    return activeSlot?.type === type && activeSlot?.index === index;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 flex flex-col items-center selection:bg-emerald-500/30">
      <div className="w-full max-w-3xl space-y-10">
        
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Poker Odds Predictor</h1>
            <p className="text-zinc-400 text-sm mt-1">Texas Hold'em Equity Calculator</p>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors text-sm font-medium text-zinc-300 hover:text-white"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset Board</span>
          </button>
        </header>
        
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Your Hand</h2>
          <div className="flex gap-4">
            <CardSlot 
              card={holeCards[0]} 
              isActive={isSlotActive('hole', 0)}
              onClick={() => handleSlotClick('hole', 0)} 
            />
            <CardSlot 
              card={holeCards[1]} 
              isActive={isSlotActive('hole', 1)}
              onClick={() => handleSlotClick('hole', 1)} 
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Community Cards</h2>
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 sm:pb-0">
            <CardSlot 
              card={communityCards[0]} label="Flop" 
              isActive={isSlotActive('community', 0)}
              onClick={() => handleSlotClick('community', 0)} 
            />
            <CardSlot 
              card={communityCards[1]} label="Flop" 
              isActive={isSlotActive('community', 1)}
              onClick={() => handleSlotClick('community', 1)} 
            />
            <CardSlot 
              card={communityCards[2]} label="Flop" 
              isActive={isSlotActive('community', 2)}
              onClick={() => handleSlotClick('community', 2)} 
            />
            <div className="w-2 sm:w-4 shrink-0" />
            <CardSlot 
              card={communityCards[3]} label="Turn" 
              isActive={isSlotActive('community', 3)}
              onClick={() => handleSlotClick('community', 3)} 
            />
            <div className="w-2 sm:w-4 shrink-0" />
            <CardSlot 
              card={communityCards[4]} label="River" 
              isActive={isSlotActive('community', 4)}
              onClick={() => handleSlotClick('community', 4)} 
            />
          </div>
        </section>

        <CardSelectorPanel 
          onSelect={handleSelectCard}
          usedCardIds={usedCardIds}
        />

        <OddsPanel holeCards={holeCards} communityCards={communityCards} />

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, Rank, Suit } from '../lib/pokerLogic';

const suits: { id: Suit; label: string; icon: string; cardColor: string; tabColor: string; activeBg: string; activeBorder: string }[] = [
  { id: 's', label: 'Spades', icon: '♠', cardColor: 'text-black', tabColor: 'text-zinc-100', activeBg: 'bg-zinc-800', activeBorder: 'border-zinc-500' },
  { id: 'h', label: 'Hearts', icon: '♥', cardColor: 'text-[#FF0000]', tabColor: 'text-[#FF0000]', activeBg: 'bg-[#FF0000]/10', activeBorder: 'border-[#FF0000]/50' },
  { id: 'd', label: 'Diamonds', icon: '♦', cardColor: 'text-orange-500', tabColor: 'text-orange-500', activeBg: 'bg-orange-500/10', activeBorder: 'border-orange-500/50' },
  { id: 'c', label: 'Clubs', icon: '♣', cardColor: 'text-blue-900', tabColor: 'text-blue-400', activeBg: 'bg-blue-900/30', activeBorder: 'border-blue-500/50' },
];

const ranks: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const topRowRanks = ranks.slice(0, 7);
const bottomRowRanks = ranks.slice(7);

const RankLabels: Record<number, string> = {
  11: 'J', 12: 'Q', 13: 'K', 14: 'A'
};
const getRankLabel = (r: number) => RankLabels[r] || r.toString();

export function CardSelectorPanel({
  onSelect,
  usedCardIds
}: {
  onSelect: (card: Card) => void;
  usedCardIds: Set<string>;
}) {
  const [activeSuit, setActiveSuit] = useState<Suit>('s');

  const renderCard = (rank: Rank) => {
    const id = `${rank}${activeSuit}`;
    const isUsed = usedCardIds.has(id);
    const suitInfo = suits.find(s => s.id === activeSuit)!;

    return (
      <button
        key={rank}
        disabled={isUsed}
        onClick={() => onSelect({ rank, suit: activeSuit, id })}
        className={`flex flex-col items-center justify-center w-10 h-14 sm:w-12 sm:h-16 md:w-14 md:h-20 rounded-md sm:rounded-lg border transition-all ${
          isUsed
            ? 'bg-zinc-200 border-zinc-300 opacity-40 cursor-not-allowed'
            : 'bg-white border-zinc-200 hover:-translate-y-1 hover:shadow-md cursor-pointer'
        }`}
      >
        <span className={`text-base sm:text-lg md:text-xl font-bold leading-none ${suitInfo.cardColor}`}>
          {getRankLabel(rank)}
        </span>
        <span className={`text-xs sm:text-sm md:text-base mt-1 leading-none ${suitInfo.cardColor}`}>
          {suitInfo.icon}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full mt-6 md:mt-8">
      {/* Suit Tabs */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-4 sm:mb-6">
        {suits.map((suit) => {
          const isActive = activeSuit === suit.id;
          return (
            <button
              key={suit.id}
              onClick={() => setActiveSuit(suit.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl border transition-all ${
                isActive 
                  ? `${suit.activeBg} ${suit.activeBorder} ${suit.tabColor}` 
                  : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
            >
              <span className={`text-lg sm:text-base ${isActive ? suit.tabColor : ''}`}>{suit.icon}</span>
              <span className="text-xs sm:text-sm font-medium">{suit.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid - 2 Rows */}
      <div className="flex flex-col gap-2 sm:gap-3 items-center w-full">
        <div className="flex justify-center gap-1 sm:gap-2 w-full">
          {topRowRanks.map(renderCard)}
        </div>
        <div className="flex justify-center gap-1 sm:gap-2 w-full">
          {bottomRowRanks.map(renderCard)}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Card, Rank, Suit } from '../lib/pokerLogic';

const suits: { id: Suit; label: string; icon: string; cardColor: string }[] = [
  { id: 's', label: 'Spades', icon: '♠', cardColor: 'text-black' },
  { id: 'h', label: 'Hearts', icon: '♥', cardColor: 'text-[#FF0000]' },
  { id: 'd', label: 'Diamonds', icon: '♦', cardColor: 'text-orange-500' },
  { id: 'c', label: 'Clubs', icon: '♣', cardColor: 'text-blue-900' },
];

const ranks: Rank[] = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

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
  const renderCard = (rank: Rank, suitId: Suit) => {
    const id = `${rank}${suitId}`;
    const isUsed = usedCardIds.has(id);
    const suitInfo = suits.find(s => s.id === suitId)!;

    return (
      <button
        key={id}
        disabled={isUsed}
        onClick={() => onSelect({ rank, suit: suitId, id })}
        className={`shrink-0 flex flex-col items-center justify-center w-[25px] h-10 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded sm:rounded-md border transition-all ${
          isUsed
            ? 'bg-zinc-200 border-zinc-300 opacity-40 cursor-not-allowed'
            : 'bg-white border-zinc-200 hover:-translate-y-1 hover:shadow-md cursor-pointer'
        }`}
      >
        <span className={`text-[13px] sm:text-base md:text-lg font-bold leading-none ${suitInfo.cardColor}`}>
          {getRankLabel(rank)}
        </span>
        <span className={`text-[10px] sm:text-xs md:text-sm mt-[2px] sm:mt-1 leading-none ${suitInfo.cardColor}`}>
          {suitInfo.icon}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full mt-6 md:mt-8 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex flex-col gap-1.5 sm:gap-2 min-w-max mx-auto items-center px-2">
        {suits.map((suit) => (
          <div key={suit.id} className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center">
            {ranks.map((rank) => renderCard(rank, suit.id))}
          </div>
        ))}
      </div>
    </div>
  );
}

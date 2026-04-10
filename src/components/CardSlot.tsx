import React from 'react';
import { Card, Suit } from '../lib/pokerLogic';

const RankLabels: Record<number, string> = {
  11: 'J', 12: 'Q', 13: 'K', 14: 'A'
};
const getRankLabel = (r: number) => RankLabels[r] || r.toString();

const SuitIcons: Record<Suit, string> = {
  s: '♠', h: '♥', d: '♦', c: '♣'
};
const SuitColorsLightBg: Record<Suit, string> = {
  s: 'text-black', 
  c: 'text-blue-900',
  h: 'text-[#FF0000]', 
  d: 'text-orange-500'
};

export function CardSlot({ 
  card, 
  onClick, 
  label,
  isActive = false
}: { 
  card: Card | null, 
  onClick: () => void, 
  label?: string,
  isActive?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 shrink-0">
      {label && <span className="text-[10px] sm:text-xs text-zinc-500 font-medium">{label}</span>}
      <button
        onClick={onClick}
        className={`w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold transition-all relative
          ${card 
            ? 'bg-white shadow-lg border border-zinc-200' 
            : 'bg-zinc-900/50 border-2 border-dashed border-zinc-700 text-zinc-600 hover:bg-zinc-800/50'
          }
          ${isActive && !card ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' : ''}
          ${isActive && card ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950' : ''}
          ${!isActive ? 'hover:-translate-y-1 hover:border-zinc-500' : ''}
        `}
      >
        {card ? (
          <div className={SuitColorsLightBg[card.suit]}>
            <div className="leading-none">{getRankLabel(card.rank)}</div>
            <div className="text-2xl sm:text-3xl md:text-4xl leading-none mt-1">{SuitIcons[card.suit]}</div>
          </div>
        ) : (
          <span className="text-2xl sm:text-3xl md:text-4xl font-light">+</span>
        )}
      </button>
    </div>
  );
}

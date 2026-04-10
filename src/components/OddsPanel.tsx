import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, runMonteCarlo, getRecommendation, SimulationResult } from '../lib/pokerLogic';

export function OddsPanel({ holeCards, communityCards }: { holeCards: (Card|null)[], communityCards: (Card|null)[] }) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const validHole = holeCards.filter(c => c !== null) as Card[];
  const validCommunity = communityCards.filter(c => c !== null) as Card[];

  useEffect(() => {
    if (validHole.length === 2) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const res = runMonteCarlo(validHole, validCommunity, 3000);
        setResult(res);
        setIsCalculating(false);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setResult(null);
    }
  }, [holeCards, communityCards]);

  if (validHole.length < 2) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 text-center">
        <p className="text-zinc-500">Select your two hole cards to see odds.</p>
      </div>
    );
  }

  if (isCalculating || !result) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-400"></div>
      </div>
    );
  }

  const total = result.win + result.tie + result.loss;
  const winPercent = ((result.win + result.tie / 2) / total * 100).toFixed(1);
  const recommendation = getRecommendation(result.winRate, validCommunity.length);

  const recColors = {
    'Raise': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Check/Call': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Fold': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Need more cards': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Win Chance</h3>
          <div className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            {winPercent}%
          </div>
          <div className="text-sm text-zinc-500 mt-2">
            Based on {total} simulated games
          </div>
        </div>

        <div className="flex-1 w-full md:w-auto md:max-w-xs">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recommendation</h3>
          <div className={`px-6 py-4 rounded-xl border text-xl font-bold text-center ${recColors[recommendation]}`}>
            {recommendation.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-xs text-zinc-500 mb-2 font-medium">
          <span>Win ({((result.win / total) * 100).toFixed(1)}%)</span>
          <span>Tie ({((result.tie / total) * 100).toFixed(1)}%)</span>
          <span>Loss ({((result.loss / total) * 100).toFixed(1)}%)</span>
        </div>
        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(result.win / total) * 100}%` }}
            className="h-full bg-emerald-500"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(result.tie / total) * 100}%` }}
            className="h-full bg-blue-500"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(result.loss / total) * 100}%` }}
            className="h-full bg-red-500"
          />
        </div>
      </div>
    </div>
  );
}

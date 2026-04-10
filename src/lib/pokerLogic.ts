export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  rank: Rank;
  suit: Suit;
  id: string;
}

export const DECK: Card[] = [];
const SUITS: Suit[] = ['s', 'h', 'd', 'c'];
for (let r = 2; r <= 14; r++) {
  for (let s of SUITS) {
    DECK.push({ rank: r as Rank, suit: s, id: `${r}${s}` });
  }
}

export function evaluateHand(cards: Card[]): number[] {
  const ranks = cards.map(c => c.rank).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);
  
  const suitCounts: Record<string, number> = {};
  let flushSuit: Suit | null = null;
  for (const s of suits) {
    suitCounts[s] = (suitCounts[s] || 0) + 1;
    if (suitCounts[s] >= 5) flushSuit = s;
  }
  
  const rankCounts: Record<number, number> = {};
  for (const r of ranks) {
    rankCounts[r] = (rankCounts[r] || 0) + 1;
  }
  
  const countGroups: Record<number, number[]> = { 4: [], 3: [], 2: [], 1: [] };
  for (const [r, count] of Object.entries(rankCounts)) {
    countGroups[count as any].push(Number(r));
  }
  for (const count in countGroups) {
    countGroups[count].sort((a, b) => b - a);
  }
  
  const getStraightHigh = (uniqueRanks: number[]) => {
    if (uniqueRanks.length < 5) return null;
    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
      if (uniqueRanks[i] - uniqueRanks[i+4] === 4) return uniqueRanks[i];
    }
    if (uniqueRanks.includes(14) && uniqueRanks.includes(5) && uniqueRanks.includes(4) && uniqueRanks.includes(3) && uniqueRanks.includes(2)) {
      return 5;
    }
    return null;
  };

  const uniqueRanks = [...new Set(ranks)];
  const straightHigh = getStraightHigh(uniqueRanks);
  
  let isFlush = false;
  let flushRanks: number[] = [];
  let isStraightFlush = false;
  let straightFlushHigh: number | null = null;
  
  if (flushSuit) {
    isFlush = true;
    flushRanks = cards.filter(c => c.suit === flushSuit).map(c => c.rank).sort((a, b) => b - a);
    straightFlushHigh = getStraightHigh([...new Set(flushRanks)]);
    if (straightFlushHigh) isStraightFlush = true;
  }
  
  if (isStraightFlush) return [8, straightFlushHigh!];
  if (countGroups[4].length > 0) {
    const quad = countGroups[4][0];
    const kicker = ranks.find(r => r !== quad)!;
    return [7, quad, kicker];
  }
  if (countGroups[3].length > 0 && (countGroups[2].length > 0 || countGroups[3].length > 1)) {
    const trip = countGroups[3][0];
    const possiblePairs = [...countGroups[2]];
    if (countGroups[3].length > 1) {
      possiblePairs.push(countGroups[3][1]);
    }
    possiblePairs.sort((a, b) => b - a);
    return [6, trip, possiblePairs[0]];
  }
  if (isFlush) return [5, ...flushRanks.slice(0, 5)];
  if (straightHigh) return [4, straightHigh];
  if (countGroups[3].length > 0) {
    const trip = countGroups[3][0];
    const kickers = ranks.filter(r => r !== trip).slice(0, 2);
    return [3, trip, ...kickers];
  }
  if (countGroups[2].length >= 2) {
    const pair1 = countGroups[2][0];
    const pair2 = countGroups[2][1];
    const kicker = ranks.find(r => r !== pair1 && r !== pair2)!;
    return [2, pair1, pair2, kicker];
  }
  if (countGroups[2].length === 1) {
    const pair = countGroups[2][0];
    const kickers = ranks.filter(r => r !== pair).slice(0, 3);
    return [1, pair, ...kickers];
  }
  return [0, ...ranks.slice(0, 5)];
}

export function compareHands(scoreA: number[], scoreB: number[]): number {
  for (let i = 0; i < Math.max(scoreA.length, scoreB.length); i++) {
    const a = scoreA[i] || 0;
    const b = scoreB[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

export interface SimulationResult {
  win: number;
  tie: number;
  loss: number;
  winRate: number;
}

export function runMonteCarlo(heroHole: Card[], community: Card[], iterations = 3000): SimulationResult {
  if (heroHole.length !== 2) return { win: 0, tie: 0, loss: 0, winRate: 0 };
  
  const knownIds = new Set([...heroHole, ...community].map(c => c.id));
  const remainingDeck = DECK.filter(c => !knownIds.has(c.id));
  
  let wins = 0;
  let ties = 0;
  let losses = 0;
  
  for (let i = 0; i < iterations; i++) {
    const needed = 2 + (5 - community.length);
    const sampled: Card[] = [];
    const deckCopy = [...remainingDeck];
    for (let j = 0; j < needed; j++) {
      const idx = Math.floor(Math.random() * deckCopy.length);
      sampled.push(deckCopy[idx]);
      deckCopy[idx] = deckCopy[deckCopy.length - 1];
      deckCopy.pop();
    }
    
    const villainHole = [sampled[0], sampled[1]];
    const simulatedCommunity = [...community, ...sampled.slice(2)];
    
    const heroScore = evaluateHand([...heroHole, ...simulatedCommunity]);
    const villainScore = evaluateHand([...villainHole, ...simulatedCommunity]);
    
    const res = compareHands(heroScore, villainScore);
    if (res > 0) wins++;
    else if (res < 0) losses++;
    else ties++;
  }
  
  return {
    win: wins,
    tie: ties,
    loss: losses,
    winRate: (wins + ties / 2) / iterations
  };
}

export function getRecommendation(winRate: number, communityCount: number): 'Raise' | 'Check/Call' | 'Fold' | 'Need more cards' {
  if (winRate === 0) return 'Need more cards';
  
  if (communityCount === 0) { // Pre-flop
    if (winRate > 0.55) return 'Raise';
    if (winRate > 0.45) return 'Check/Call';
    return 'Fold';
  } else if (communityCount === 3) { // Flop
    if (winRate > 0.65) return 'Raise';
    if (winRate > 0.40) return 'Check/Call';
    return 'Fold';
  } else if (communityCount === 4) { // Turn
    if (winRate > 0.70) return 'Raise';
    if (winRate > 0.40) return 'Check/Call';
    return 'Fold';
  } else { // River
    if (winRate > 0.75) return 'Raise';
    if (winRate > 0.45) return 'Check/Call';
    return 'Fold';
  }
}

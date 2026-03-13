import { Card, TileItem } from '../types';

// Fisher-Yates Shuffle
export const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateDeck = (items: TileItem[]): Card[] => {
  const deck: Card[] = [];
  
  items.forEach((item) => {
    // Create two cards for each item
    deck.push({
      id: `${item.name}-1`,
      matchId: item.name,
      item,
      isFlipped: false,
      isMatched: false,
    });
    deck.push({
      id: `${item.name}-2`,
      matchId: item.name,
      item,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleCards(deck);
};
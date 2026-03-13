export interface TileItem {
  name: string;
  emoji: string;
}

export type CategoryId = 'feelings' | 'hobbies' | 'requests';

export interface Card {
  id: string; // Unique ID for React keys
  matchId: string; // ID used to check for matches (e.g., the name)
  item: TileItem;
  isFlipped: boolean;
  isMatched: boolean;
}
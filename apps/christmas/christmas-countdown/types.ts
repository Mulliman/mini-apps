export interface WindowState {
  id: number;
  isOpen: boolean;
}

export interface GameState {
  currentNumber: number;
  isComplete: boolean;
  windows: WindowState[];
}

export type LoadingState = 'idle' | 'loading' | 'error' | 'success';
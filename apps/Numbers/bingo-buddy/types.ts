export interface BingoCallMap {
  [key: string]: string;
}

export enum GameState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  REVEALING = 'REVEALING', // Ball is zooming in
  WAITING = 'WAITING',     // Ball is shown, waiting for user input
  FINISHED = 'FINISHED'
}

export interface BallColor {
  bg: string;
  text: string;
  border: string;
  shadow: string;
}
export interface BusData {
  id: string;
  number: number;
  x: number; // Percentage 0-100 or pixels
  direction: 'left-to-right' | 'right-to-left';
  state: 'moving' | 'celebrating' | 'leaving';
  speed: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
}

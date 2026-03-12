
export type ElementCategory = 
  | 'alkali metal'
  | 'alkaline earth metal'
  | 'transition metal'
  | 'post-transition metal'
  | 'metalloid'
  | 'reactive nonmetal'
  | 'noble gas'
  | 'lanthanide'
  | 'actinide'
  | 'halogen'
  | 'unknown';

export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: ElementCategory;
  group: number;
  period: number;
  summary: string;
  usage?: string;
  etymology?: string;
  appearance?: string;
  discoveredBy?: string;
  melt?: number;
  boil?: number;
}


import { ElementCategory } from './types';

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali metal': 'bg-red-600',
  'alkaline earth metal': 'bg-orange-600',
  'transition metal': 'bg-lime-500',
  'post-transition metal': 'bg-green-500',
  'metalloid': 'bg-teal-500',
  'reactive nonmetal': 'bg-blue-500',
  'noble gas': 'bg-slate-500',
  'lanthanide': 'bg-amber-500',
  'actinide': 'bg-yellow-400',
  'halogen': 'bg-purple-600',
  'unknown': 'bg-zinc-700',
};

export const CATEGORY_GRADIENTS: Record<ElementCategory, string> = {
  'alkali metal': 'from-red-600 to-red-950',
  'alkaline earth metal': 'from-orange-600 to-red-950',
  'transition metal': 'from-lime-500 to-lime-900',
  'post-transition metal': 'from-green-500 to-green-900',
  'metalloid': 'from-teal-500 to-teal-950',
  'reactive nonmetal': 'from-blue-500 to-blue-900',
  'noble gas': 'from-slate-500 to-slate-900',
  'lanthanide': 'from-amber-500 to-amber-900',
  'actinide': 'from-yellow-400 to-yellow-800',
  'halogen': 'from-purple-600 to-purple-950',
  'unknown': 'from-zinc-700 to-zinc-950',
};

export const getDisplayCategory = (cat: string): string => {
  return cat.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

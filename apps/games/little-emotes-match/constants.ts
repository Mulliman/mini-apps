import { TileItem, CategoryId } from './types';

export const ITEM_COLORS: Record<string, string> = {
  // Feelings
  "Happy": "bg-yellow-100 border-yellow-400 text-yellow-800",
  "Sad": "bg-blue-100 border-blue-400 text-blue-800",
  "Angry": "bg-red-100 border-red-400 text-red-800",
  "Tired": "bg-indigo-100 border-indigo-400 text-indigo-800",
  "Scared": "bg-purple-100 border-purple-400 text-purple-800",
  "Poorly": "bg-green-100 border-green-400 text-green-800",
  "Excited": "bg-pink-100 border-pink-400 text-pink-800",
  "Calm": "bg-teal-100 border-teal-400 text-teal-800",

  // Hobbies
  "TV": "bg-slate-100 border-slate-400 text-slate-800",
  "Music": "bg-violet-100 border-violet-400 text-violet-800",
  "Computer": "bg-zinc-100 border-zinc-400 text-zinc-800",
  "Toys": "bg-orange-100 border-orange-400 text-orange-800",
  "Garden": "bg-emerald-100 border-emerald-400 text-emerald-800",
  "Puzzle": "bg-cyan-100 border-cyan-400 text-cyan-800",
  "Book": "bg-blue-100 border-blue-400 text-blue-800",
  "Walk": "bg-lime-100 border-lime-400 text-lime-800",

  // Requests
  "Potty": "bg-sky-100 border-sky-400 text-sky-800",
  "Food": "bg-red-100 border-red-400 text-red-800",
  "Drink": "bg-blue-100 border-blue-400 text-blue-800",
  "Bed": "bg-indigo-100 border-indigo-400 text-indigo-800",
  "Cuddle": "bg-pink-100 border-pink-400 text-pink-800",
  "Play": "bg-yellow-100 border-yellow-400 text-yellow-800",
  "Stop": "bg-rose-100 border-rose-400 text-rose-800",
  "Quiet": "bg-gray-100 border-gray-400 text-gray-800",
};

export const FEELINGS_LIST: TileItem[] = [
  { name: "Happy", emoji: "😊" },
  { name: "Sad", emoji: "😢" },
  { name: "Angry", emoji: "😡" },
  { name: "Tired", emoji: "😴" },
  { name: "Scared", emoji: "😨" },
  { name: "Poorly", emoji: "🤢" },
  { name: "Excited", emoji: "🤩" },
  { name: "Calm", emoji: "😌" }
];

export const HOBBIES_LIST: TileItem[] = [
  { name: "TV", emoji: "📺" },
  { name: "Music", emoji: "💃" },
  { name: "Computer", emoji: "💻" },
  { name: "Toys", emoji: "🧸" },
  { name: "Garden", emoji: "🌷" },
  { name: "Puzzle", emoji: "🧩" },
  { name: "Book", emoji: "📖" },
  { name: "Walk", emoji: "🚶" }
];

export const REQUESTS_LIST: TileItem[] = [
  { name: "Potty", emoji: "🚽" },
  { name: "Food", emoji: "🥗" },
  { name: "Drink", emoji: "🥤" },
  { name: "Bed", emoji: "🛌" },
  { name: "Cuddle", emoji: "🤗" },
  { name: "Play", emoji: "🤸" },
  { name: "Stop", emoji: "✋" },
  { name: "Quiet", emoji: "🤫" }
];

export const DATA_SETS: Record<CategoryId, TileItem[]> = {
  feelings: FEELINGS_LIST,
  hobbies: HOBBIES_LIST,
  requests: REQUESTS_LIST
};

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  feelings: "Feelings",
  hobbies: "Hobbies",
  requests: "Requests"
};
export interface AppInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
}

export const appsData: AppInfo[] = [
  {
    id: "example-tic-tac-toe",
    title: "Tic-Tac-Toe",
    category: "Games",
    description: "A classic game built with React.",
    url: "/apps/examples/tic-tac-toe/index.html",
  },
  {
    id: "example-todo",
    title: "To-Do List",
    category: "Productivity",
    description: "Manage your daily tasks efficiently.",
    url: "/apps/examples/todo/index.html",
  },
  {
    id: "number-bus-london",
    title: "Number Bus London",
    category: "Letters and Numbers",
    description: "A simple educational game for toddlers where they identify and type numbers on a moving London bus.",
    url: "/apps/letters-and-numbers/NumberBus/index.html",
  },
  {
    id: "bingo-buddy",
    title: "Bingo Buddy",
    category: "Letters and Numbers",
    description: "A colorful and interactive Bingo caller app for children with animations and voice announcements.",
    url: "/apps/letters-and-numbers/bingo-buddy/index.html",
  },
  {
    id: "number-plate-pop",
    title: "Number Plate Pop",
    category: "Letters and Numbers",
    description: "A fun and simple number plate matching game designed for toddlers.",
    url: "/apps/letters-and-numbers/number-plate-pop/index.html",
  }
];

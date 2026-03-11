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
    category: "Numbers",
    description: "A simple educational game for toddlers where they identify and type numbers on a moving London bus.",
    url: "/apps/Numbers/NumberBus/index.html",
  }
];

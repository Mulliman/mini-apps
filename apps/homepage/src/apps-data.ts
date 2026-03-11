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
    url: "/games/tic-tac-toe",
  },
  {
    id: "example-todo",
    title: "To-Do List",
    category: "Productivity",
    description: "Manage your daily tasks efficiently.",
    url: "/productivity/todo",
  }
];

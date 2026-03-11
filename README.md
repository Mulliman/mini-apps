# MiniApps Monorepo

This repository acts as a single home for multiple React applications, specifically aimed at hosting applications created in Google AI Studio or similar tools. This monorepo allows for easy management, shared dependencies, and unified hosting.

## Structure

The applications are located in the `apps` folder. The `apps` folder can be subdivided into categories (e.g., `apps/games`, `apps/utilities`).

- `apps/homepage/`: The main entry portal that displays a card for each application in the monorepo.
- `apps/examples/`: A sample directory where you can place categorized applications.

## How to Work with This Monorepo

We use `pnpm` workspaces for package management. This approach guarantees that dependencies are hoisted to the root directory where possible, significantly reducing disk space consumption and speeding up installation.

### 1. Prerequisites
- Node.js (version 18 or above recommended)
- `pnpm` (`npm install -g pnpm`)

### 2. Adding a New React App
To integrate a new React app (e.g. from Google AI Studio) into this monorepo, follow these steps:

1. Create a category folder if it does not exist (e.g., `apps/games/`).
2. Move your React application into that category folder (e.g., `apps/games/my-new-game`).
3. Delete the `node_modules` folder, `package-lock.json`, or `yarn.lock` from the new app's directory. We only use `pnpm` at the root.
4. From the root of this monorepo, run:
   ```bash
   pnpm install
   ```
   This will install and link all dependencies for the new app alongside existing ones.

### 3. Displaying the App on the Homepage
To make the new application show up on the homepage:
1. Open the `apps/homepage/src/apps-data.ts` (or equivalent data file).
2. Add an entry for your new application:
   ```json
   {
     "id": "my-new-game",
     "title": "My New Game",
     "category": "Games",
     "description": "An awesome game created in AI Studio.",
     "url": "/games/my-new-game"
   }
   ```
3. Update routing or proxy settings if necessary depending on the deployment strategy.

### 4. Running the Apps Locally
To run all applications simultaneously (useful for development with the homepage):
```bash
pnpm dev
```
To run a specific application, navigate to its directory and run:
```bash
cd apps/games/my-new-game
pnpm dev
```

### 5. Deployment
When building for production, the root command `pnpm build` will execute the build script for every package within the `apps` workspace.

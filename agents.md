# Agent Guidelines for the MiniApps Monorepo

You are interacting with a `pnpm` workspace monorepo designed to host multiple independent React applications, primarily sourced from Google AI Studio, alongside a unified homepage.

When assisting the user with this repository, strict adherence to the following rules is required.

## 1. Package Management (CRITICAL)
- **Always use `pnpm`**. Never execute `npm install` or `yarn install` within the root or anywhere in the subdirectories.
- Dependencies are managed at the workspace level.
- When the user asks to "add an app", ensure you instruct them (or perform the steps if acting autonomously) to remove any non-pnpm lockfiles (`package-lock.json`, `yarn.lock`) from the new app before running `pnpm install` at the root.

## 2. Directory Structure
- All applications reside inside the `apps/` directory.
- `apps/` contains subdirectories representing categories (e.g., `apps/games/`, `apps/productivity/`).
- `apps/homepage/` is a reserved directory for the main portal application. Read and modify `apps/homepage` when handling requests to display newly added applications.
- Do not create applications directly in the root directory.

## 3. Adding New Features or Apps
When asked to add a new app to the monorepo:
1.  **Placement:** Place it within the `apps/` directory under a logical category subfolder (create the category if it doesn't exist).
2.  **Naming:** Ensure the app has a `package.json` with a clear, unique `name` attribute (e.g., `"name": "@miniapps/tic-tac-toe"`).
3.  **Dependencies:** Run `pnpm install` from the root of the monorepo. Do not run installations inside the app folder directly.
4.  **Homepage Integration:** Automatically search for where the homepage retrieves the list of apps (typically a JSON or TS file in `apps/homepage/src/`) and append the new app's metadata to ensure it shows up without needing the user to explicitly ask.

## 4. Homepage Responsibilities
The homepage is responsible for displaying a grid/list of all available apps. Always ensure the design of this homepage remains visually appealing, responsive, and organized by categories.
## 5. Avoiding 404 Errors (Path Handling)
When adding or modifying an app, ensure that all resource links in `index.html` (e.g., `<script src="...">`, `<link href="...">`) use **relative paths** (starting with `./`) instead of absolute paths (starting with `/`). 
- **Correct:** `<script src="./index.tsx"></script>`
- **Incorrect:** `<script src="/index.tsx"></script>`
This is critical for the monorepo structure where apps are served under subdirectories like `/apps/category/app-name/`.

## 6. Dependency Consistency
- If you encounter "Failed to resolve react" errors when running from the root, ensure `react` and `react-dom` are present in the root `package.json`'s `devDependencies`.
- New apps should have their own `package.json` with unique names as per Section 3.

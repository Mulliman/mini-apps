import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

async function build() {
  console.log('🚀 Starting combined build...');

  // 1. Clean root dist
  if (fs.existsSync(distDir)) {
    console.log('🧹 Cleaning root dist...');
    fs.removeSync(distDir);
  }
  fs.ensureDirSync(distDir);

  // 2. Build and copy homepage
  console.log('🏠 Building homepage...');
  execSync('pnpm --filter @miniapps/homepage run build', { cwd: rootDir, stdio: 'inherit' });
  fs.copySync(path.resolve(rootDir, 'apps/homepage/dist'), distDir);

  // 3. Find other apps
  const appsBaseDir = path.resolve(rootDir, 'apps');
  const categories = fs.readdirSync(appsBaseDir).filter(f => 
    fs.statSync(path.join(appsBaseDir, f)).isDirectory() && 
    !['homepage', 'shared', 'examples'].includes(f)
  );

  for (const category of categories) {
    const categoryDir = path.join(appsBaseDir, category);
    const apps = fs.readdirSync(categoryDir).filter(f => 
      fs.statSync(path.join(categoryDir, f)).isDirectory()
    );

    for (const app of apps) {
      const appPath = path.join(categoryDir, app);
      const pkgJsonPath = path.join(appPath, 'package.json');
      
      if (fs.existsSync(pkgJsonPath)) {
        console.log(`📦 Building app: ${category}/${app}...`);
        try {
          execSync('pnpm run build', { cwd: appPath, stdio: 'inherit' });
          
          const targetDir = path.join(distDir, 'apps', category, app);
          fs.ensureDirSync(targetDir);
          
          // Check if it's a Vite app (has dist) or just static
          const appDist = path.join(appPath, 'dist');
          if (fs.existsSync(appDist)) {
            fs.copySync(appDist, targetDir);
          } else {
            // Copy everything except node_modules etc. if no dist
            fs.copySync(appPath, targetDir, {
              filter: (src) => !src.includes('node_modules') && !src.includes('.git')
            });
          }
        } catch (err) {
          console.error(`❌ Failed to build ${app}:`, err.message);
        }
      }
    }
  }

  console.log('✅ Combined build complete! Output is in ./dist');
}

build().catch(err => {
  console.error('💥 Build failed:', err);
  process.exit(1);
});

const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const inRoot = fs.existsSync(path.join(__dirname, 'frontend', 'package.json'));

if (inRoot) {
  console.log('[Build Script] Detected running from root directory.');
  cp.execSync('npm run build --prefix frontend', { stdio: 'inherit' });
  const src = path.join(__dirname, 'frontend', 'out');
  const dest = path.join(__dirname, 'out');
  if (fs.existsSync(src)) {
    console.log('[Build Script] Mirroring frontend/out to root out/');
    fs.cpSync(src, dest, { recursive: true });
  }
} else {
  console.log('[Build Script] Detected running inside frontend directory.');
  cp.execSync('npx next build', { stdio: 'inherit' });
  const src = path.join(__dirname, 'out');
  const dest = path.join(__dirname, 'frontend', 'out');
  if (fs.existsSync(src)) {
    console.log('[Build Script] Mirroring out to frontend/out/');
    fs.mkdirSync(path.join(__dirname, 'frontend'), { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
  }
}

console.log('[Build Script] Build finished successfully!');

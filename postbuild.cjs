const fs = require('fs');
const path = require('path');

console.log('[Postbuild] Mirroring build output for Vercel...');

const possibleOutDirs = [
  path.join(__dirname, 'out'),
  path.join(__dirname, 'frontend', 'out'),
  path.join(process.cwd(), 'out'),
  path.join(process.cwd(), 'frontend', 'out')
];

let sourceOut = null;
for (const dir of possibleOutDirs) {
  if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.html'))) {
    sourceOut = dir;
    break;
  }
}

if (!sourceOut) {
  console.log('[Postbuild] Warning: Could not find generated out directory.');
} else {
  console.log('[Postbuild] Found source output at:', sourceOut);

  const targets = [
    path.join(__dirname, 'dist'),
    path.join(__dirname, 'frontend', 'dist'),
    path.join(__dirname, 'frontend', 'out'),
    path.join(__dirname, 'out'),
    path.join(process.cwd(), 'dist'),
    path.join(process.cwd(), 'frontend', 'dist')
  ];

  for (const target of targets) {
    if (target !== sourceOut) {
      try {
        fs.mkdirSync(target, { recursive: true });
        fs.cpSync(sourceOut, target, { recursive: true });
        console.log('[Postbuild] Mirrored to:', target);
      } catch (e) {
        console.warn('[Postbuild] Notice:', e.message);
      }
    }
  }
  console.log('[Postbuild] Successfully prepared dist and out directories for Vercel!');
}

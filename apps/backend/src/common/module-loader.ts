import fs from 'fs';
import path from 'path';

const EXCLUDED_DIRS = new Set<string>(['common', 'node_modules', 'dist']);

function isFile(targetPath: string) {
  try {
    return fs.statSync(targetPath).isFile();
  } catch {
    return false;
  }
}

function isDirectory(targetPath: string) {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

function walkAndRequire(dir: string) {
  if (!isDirectory(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (isDirectory(full)) {
      walkAndRequire(full);
    } else if (isFile(full)) {
      // Load TS during dev and JS in prod; skip declaration files
      if (
        (full.endsWith('.ts') && !full.endsWith('.d.ts')) ||
        full.endsWith('.js') ||
        full.endsWith('.cjs') ||
        full.endsWith('.mjs')
      ) {
        require(full);
      }
    }
  }
}

export function loadAllModules(baseDir: string = path.join(__dirname, '..')) {
  // Dynamically discover immediate subdirectories under baseDir (src)
  let candidates: string[] = [];
  try {
    candidates = fs.readdirSync(baseDir).filter((entry) => {
      if (EXCLUDED_DIRS.has(entry)) return false;
      const full = path.join(baseDir, entry);
      return isDirectory(full);
    });
  } catch {
    candidates = [];
  }

  for (const dir of candidates) {
    const target = path.join(baseDir, dir);
    walkAndRequire(target);
  }
}


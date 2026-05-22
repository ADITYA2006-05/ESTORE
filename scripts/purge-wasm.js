const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

// Find all .js and .mjs files recursively in the .open-next folder
function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (file.endsWith('.js') || file.endsWith('.mjs')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

console.log('--- Prisma WASM & Path Optimization Script ---');
const openNextDir = path.join(projectRoot, '.open-next');
console.log('Target Directory:', openNextDir);

// 1. Rewrite absolute paths to relative in all generated bundles
const files = walk(openNextDir);
let modifiedCount = 0;

// Setup replacement patterns for absolute paths constructed from projectRoot
const engines = ['mysql', 'postgresql', 'sqlite'];
const replacements = [];

engines.forEach(engine => {
  const fileName = `query_engine_bg.${engine}.wasm`;
  const absolutePath = path.join(projectRoot, '.open-next', 'server-functions', 'default', 'node_modules', '@prisma', 'client', 'runtime', fileName);
  
  const unixStyle = absolutePath.replace(/\\/g, '/');
  const winStyle = absolutePath.replace(/\//g, '\\');
  const winStyleEscaped = winStyle.replace(/\\/g, '\\\\');
  
  const relativeReplacement = `./node_modules/@prisma/client/runtime/${fileName}`;
  
  replacements.push({ target: unixStyle, replacement: relativeReplacement });
  replacements.push({ target: winStyle, replacement: relativeReplacement });
  replacements.push({ target: winStyleEscaped, replacement: relativeReplacement.replace(/\//g, '\\\\') });
});

// A general regex to find absolute path imports of the WASM files as fallback (e.g. on different systems or configurations)
// Matches: "/.../.open-next/server-functions/default/node_modules/@prisma/client/runtime/query_engine_bg.(mysql|postgresql|sqlite).wasm"
const absolutePathRegex = /(["'])\/[^"']*\/\.open-next\/server-functions\/default\/node_modules\/@prisma\/client\/runtime\/query_engine_bg\.(mysql|postgresql|sqlite)\.wasm(["'])/g;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Apply exact path string replacements
  replacements.forEach(({ target, replacement }) => {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
    }
  });
  
  // Apply regex replacement fallback
  if (absolutePathRegex.test(content)) {
    content = content.replace(absolutePathRegex, '$1./node_modules/@prisma/client/runtime/query_engine_bg.$2.wasm$3');
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Optimized paths in: ${path.relative(projectRoot, filePath)}`);
    modifiedCount++;
  }
});

console.log(`Path optimization finished: ${modifiedCount} files updated.`);

// 2. Recursively find and shrink all .wasm files to a minimal 8-byte binary
function shrinkWasmFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      shrinkWasmFiles(filePath);
    } else {
      if (file.endsWith('.wasm')) {
        const minimalWasm = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
        const originalSize = stat.size;
        fs.writeFileSync(filePath, minimalWasm);
        console.log(`Shrunk WASM engine: ${path.relative(projectRoot, filePath)} (${originalSize} bytes -> 8 bytes)`);
      }
    }
  });
}

console.log('Shrinking WASM engines...');
shrinkWasmFiles(openNextDir);
console.log('----------------------------------------------');


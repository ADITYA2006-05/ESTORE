const fs = require('fs');
const path = require('path');

// Determine which engine we want to preserve based on environment or default to postgresql/sqlite
const PRESERVE_ENGINE = process.env.DATABASE_PROVIDER || 'sqlite'; // 'sqlite' or 'postgresql'

const targetDir = path.join(__dirname, '..', '.open-next', 'server-functions', 'default', 'node_modules', '@prisma', 'client', 'runtime');

console.log('--- Prisma WASM Optimization Script ---');
console.log('Target Directory:', targetDir);
console.log('Preserving Engine:', PRESERVE_ENGINE);

if (fs.existsSync(targetDir)) {
  const files = fs.readdirSync(targetDir);
  
  files.forEach(file => {
    if (file.endsWith('.wasm')) {
      const isPostgres = file.includes('postgresql');
      const isSqlite = file.includes('sqlite');
      const isMysql = file.includes('mysql');
      
      let shouldDelete = false;
      
      if (PRESERVE_ENGINE === 'sqlite') {
        // Purge postgresql and mysql
        if (isPostgres || isMysql) shouldDelete = true;
      } else if (PRESERVE_ENGINE === 'postgresql') {
        // Purge sqlite and mysql
        if (isSqlite || isMysql) shouldDelete = true;
      } else {
        // Purge mysql by default if unknown
        if (isMysql) shouldDelete = true;
      }
      
      if (shouldDelete) {
        const filePath = path.join(targetDir, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`Successfully purged: ${file} (Reduced bundle size)`);
        } catch (err) {
          console.error(`Failed to delete ${file}:`, err.message);
        }
      } else {
        console.log(`Preserved: ${file} (Active database engine)`);
      }
    }
  });
  console.log('---------------------------------------');
} else {
  console.log('Notice: .open-next build output not found yet. Skipping purge.');
  console.log('---------------------------------------');
}

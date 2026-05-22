const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  console.log('⌛ Connecting to Neon PostgreSQL...');
  try {
    const start = Date.now();
    const count = await prisma.product.count();
    const duration = Date.now() - start;
    console.log(`✅ Success! Connected to Neon PostgreSQL in ${duration}ms.`);
    console.log(`📦 Found ${count} products in the database.`);
    
    if (count > 0) {
      console.log('\nList of Products in Database:');
      const products = await prisma.product.findMany({ select: { name: true, price: true, category: true } });
      products.forEach((p, idx) => {
        console.log(`  ${idx + 1}. ${p.name} ($${p.price}) - [${p.category}]`);
      });
    } else {
      console.log('⚠️ Database is empty. You may need to run seed script.');
    }
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

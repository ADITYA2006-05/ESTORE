const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      name: 'Minimalist Watch',
      description: 'A clean and elegant watch for any occasion.',
      price: 120.0,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      category: 'Accessories',
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Soft and breathable cotton t-shirt in mint green.',
      price: 35.0,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      category: 'Apparel',
    },
    {
      name: 'Leather Backpack',
      description: 'Durable and stylish backpack for everyday use.',
      price: 85.0,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      category: 'Accessories',
    },
    {
      name: 'Ceramic Mug',
      description: 'Handcrafted ceramic mug with a soft finish.',
      price: 24.0,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      category: 'Home',
    },
    {
      name: 'Linen Bedding',
      description: 'Premium linen bedding for a comfortable night\'s sleep.',
      price: 150.0,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      category: 'Home',
    },
    {
      name: 'Designer Sunglasses',
      description: 'Modern sunglasses with UV protection.',
      price: 65.0,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      category: 'Accessories',
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

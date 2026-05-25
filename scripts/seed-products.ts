import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Curated lists to programmatically generate 50 unique products per category
const adjectives = ['Minimalist', 'Premium', 'Eco-Friendly', 'Handcrafted', 'Modern', 'Classic', 'Essential', 'Luxury', 'Organic', 'Urban', 'Sleek', 'Durable', 'Timeless', 'Artisan', 'Studio', 'Nordic', 'Ergonomic', 'Refined', 'Structured', 'Lightweight', 'Signature', 'Tailored', 'Cozy', 'Compact', 'Smart']
const materials = ['Linen', 'Cotton', 'Leather', 'Bamboo', 'Ceramic', 'Wool', 'Silicone', 'Canvas', 'Stainless Steel', 'Oak Wood', 'Denim', 'Aluminium', 'Suede', 'Brass', 'Glass', 'Copper']

interface ProductGenInfo {
  category: string
  bases: string[]
  descriptions: string[]
  images: string[]
  minPrice: number
  maxPrice: number
}

const categoriesInfo: Record<string, ProductGenInfo> = {
  'Apparel': {
    category: 'Apparel',
    bases: ['T-Shirt', 'Button-Down Shirt', 'Trousers', 'Chino Pants', 'Jacket', 'Sweater', 'Hoodie', 'Shorts', 'Cardigan', 'Blazer', 'Overcoat', 'Polo Shirt', 'Joggers', 'Vest', 'Trenchcoat'],
    descriptions: [
      'Tailored from premium breathable fibers for perfect everyday drape and comfort.',
      'Designed for structural elegance, making it an essential piece for any modern wardrobe.',
      'Features a relaxed fit, reinforced seams, and double-stitched hems for outstanding longevity.',
      'A versatile item perfect for layering across seasons or wearing solo on active days.',
      'Consciously sourced and produced using sustainable fabric that feels soft against the skin.'
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'
    ],
    minPrice: 899,
    maxPrice: 4999
  },
  'Accessories': {
    category: 'Accessories',
    bases: ['Wallet', 'Backpack', 'Sunglasses', 'Belt', 'Key Organizer', 'Watch', 'Cardholder', 'Messenger Bag', 'Duffel Bag', 'Scarf', 'Cap', 'Gloves', 'Bracelet', 'Tie Clip', 'Ring'],
    descriptions: [
      'Handcrafted with pristine details to combine sleek utility with everyday elegance.',
      'Features a smart, high-capacity layout tailored for streamlined organization.',
      'Constructed with custom-brushed hardware and refined finishes to elevate your style.',
      'The ultimate travel companion offering protective compartments and secure closures.',
      'Crafted from resilient materials designed to acquire a unique character over years of use.'
    ],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80',
      'https://images.unsplash.com/photo-1627124793833-28029ff35b03?w=600&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80'
    ],
    minPrice: 499,
    maxPrice: 8999
  },
  'Home': {
    category: 'Home',
    bases: ['Mug', 'Vase', 'Blanket', 'Desk Organizer', 'Diffuser', 'Tray', 'Cushion', 'Planter', 'Storage Basket', 'Candle Holder', 'Scented Candle', 'Coaster Set', 'Wall Shelf', 'Table Mirror', 'Carafe'],
    descriptions: [
      'Brings natural elements and organic textures to elevate your modern living spaces.',
      'Carefully crafted by artisans to balance functional convenience with sculptural beauty.',
      'Designed to reduce clutter and bring a calm, aesthetic order to your home environment.',
      'A beautiful accent piece that blends seamlessly into minimalist, mid-century, or modern rooms.',
      'Made from durable, eco-friendly resources designed to bring comfort and warmth to your daily routines.'
    ],
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80'
    ],
    minPrice: 399,
    maxPrice: 3499
  },
  'Food': {
    category: 'Food',
    bases: ['Matcha Powder', 'Coffee Beans', 'Cold-Pressed Oil', 'Herbal Tea Blend', 'Honey jar', 'Maple Syrup', 'Sea Salt Flakes', 'Granola', 'Spice Blend', 'Dried Fruit Mix', 'Dark Chocolate Bar', 'Fruit Spread', 'Nut Butter', 'Botanical Syrup', 'Aceto Balsamico'],
    descriptions: [
      'Sourced from small-batch family farms utilizing organic and traditional cultivation methods.',
      'Carefully roasted or milled to preserve delicate natural aromas and robust nutritional benefits.',
      'Free from artificial additives or preservatives, delivering a pure and authentic taste experience.',
      'A wonderful addition to your daily dietary ritual that nurtures both body and mind.',
      'Packaged in eco-friendly glass jars to preserve ultimate freshness and support sustainable living.'
    ],
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
      'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&q=80',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80'
    ],
    minPrice: 299,
    maxPrice: 1999
  },
  'Daily Wear': {
    category: 'Daily Wear',
    bases: ['Socks Set', 'Slippers', 'Sneakers', 'Loungewear Robe', 'Sleep Mask', 'Beanie', 'Scarf', 'Slides', 'Jogger Socks', 'Pajama Top', 'Sweatband Set', 'Hair Band', 'Thermal Vest', 'Canvas Slip-ons', 'Tote Bag'],
    descriptions: [
      'Ultra-comfortable, ergonomic fit designed for absolute ease and active daily routines.',
      'Engineered with premium moisture-wicking weave to keep you fresh and dry all day.',
      'A perfect blend of soft loungewear and structural durability for quick errands.',
      'Designed to reduce friction and feel incredibly light, cozy, and non-restrictive.',
      'Crafted from resilient natural cotton blends that retain shape and comfort through endless washes.'
    ],
    images: [
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'
    ],
    minPrice: 199,
    maxPrice: 5999
  },
  'Electronics': {
    category: 'Electronics',
    bases: ['Wireless Charger', 'Earbuds', 'Power Bank', 'Smart Plug', 'Desk Lamp', 'Bluetooth Speaker', 'Cable Organizer', 'Laptop Stand', 'Stylus Pen', 'Humidifier', 'Ambient Light Strip', 'Charging Station', 'Mouse Pad', 'Travel Adapter', 'Sleek Keyboard'],
    descriptions: [
      'Features high-performance circuitry wrapped in a beautiful, space-saving minimalist design.',
      'Engineered with premium acoustic chambers to deliver crystal-clear acoustics and balanced soundscapes.',
      'Designed to blend seamlessly with your office workspace setup while maximizing productivity.',
      'Built with advanced temperature safeguards and automatic energy-saving sensors.',
      'Constructed with aluminum housings and modern interfaces to support high-speed daily connectivity.'
    ],
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80',
      'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=600&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80'
    ],
    minPrice: 799,
    maxPrice: 12999
  }
}

async function main() {
  console.log('🌱 Starting database seeding: Generating 50 products per category (300 items total)...')
  console.log('Stock will be set exactly to 10 for all generated items.')

  // Optional: clear existing products if you want to avoid duplicates/bloat.
  // We keep existing products and just add 50 new ones per category.
  // To keep it fresh, we can delete the current items first, ensuring a clean and perfect set of exactly 50 per category.
  const confirmClean = true
  if (confirmClean) {
    console.log('🧹 Purging current product catalog to prevent overlap...')
    await prisma.product.deleteMany({})
    console.log('✅ Current product database cleared.')
  }

  const allProducts: Array<{
    name: string
    description: string
    price: number
    image: string
    category: string
    stock: number
  }> = []

  for (const catName of Object.keys(categoriesInfo)) {
    const info = categoriesInfo[catName]
    const createdNames = new Set<string>()

    console.log(`➡️ Generating 50 items for category: "${catName}"...`)

    let itemIndex = 1
    while (itemIndex <= 50) {
      // Pick random parts
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
      const mat = materials[Math.floor(Math.random() * materials.length)]
      const base = info.bases[Math.floor(Math.random() * info.bases.length)]

      // Generate a realistic, distinct product name
      const name = `${adj} ${mat} ${base}`

      // Skip duplicate names in this run
      if (createdNames.has(name)) {
        continue
      }
      createdNames.add(name)

      // Choose random description and image
      const desc = info.descriptions[Math.floor(Math.random() * info.descriptions.length)]
      const img = info.images[Math.floor(Math.random() * info.images.length)]

      // Generate price between min and max
      const price = Math.round((Math.random() * (info.maxPrice - info.minPrice) + info.minPrice))

      allProducts.push({
        name,
        description: `${desc} This premium ${name.toLowerCase()} offers an unmatched aesthetic value and premium quality.`,
        price,
        image: img,
        category: catName,
        stock: 10 // stock exactly 10
      })

      itemIndex++
    }
  }

  console.log(`⌛ Writing ${allProducts.length} products to database in bulk transaction...`)
  
  // Create all items using prisma createMany
  await prisma.product.createMany({
    data: allProducts
  })

  console.log('==================================================')
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!')
  console.log('==================================================')
  console.log(`💎 Added a total of ${allProducts.length} items to database!`)
  console.log(`📊 50 items seeded in each of the 6 categories with stock: 10.`)
  console.log('==================================================')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

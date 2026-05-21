import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'

export const revalidate = 0 // Disable cache to always have live dynamic item counts

export default async function Categories() {
  let apparelCount = 0
  let accessoriesCount = 0
  let homeCount = 0
  let foodCount = 0
  let dailyWearCount = 0
  let electronicsCount = 0

  try {
    apparelCount = await prisma.product.count({ where: { category: { equals: 'Apparel' } } })
    accessoriesCount = await prisma.product.count({ where: { category: { equals: 'Accessories' } } })
    homeCount = await prisma.product.count({ where: { category: { equals: 'Home' } } })
    foodCount = await prisma.product.count({ where: { category: { equals: 'Food' } } })
    dailyWearCount = await prisma.product.count({ where: { category: { equals: 'Daily Wear' } } })
    electronicsCount = await prisma.product.count({ where: { category: { equals: 'Electronics' } } })
  } catch (error) {
    console.error('Failed to query category counts from DB:', error)
  }

  const categories = [
    {
      name: 'Apparel',
      description: 'Linen garments, organic cotton basics, and relaxed-fit designer wear.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      count: apparelCount,
      link: '/shop?category=Apparel'
    },
    {
      name: 'Accessories',
      description: 'Titanium chronographs, handcrafted leather backpacks, and UV sunglasses.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      count: accessoriesCount,
      link: '/shop?category=Accessories'
    },
    {
      name: 'Home',
      description: 'Handcrafted ceramic dishware, linen bedding, and workspace organizers.',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      count: homeCount,
      link: '/shop?category=Home'
    },
    {
      name: 'Food',
      description: 'Artisan green tea collections, organic cold-pressed oils, and pantry botanicals.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      count: foodCount,
      link: '/shop?category=Food'
    },
    {
      name: 'Daily Wear',
      description: 'Ultra-soft socks, casual loungewear robes, and luxury walking sneakers.',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
      count: dailyWearCount,
      link: '/shop?category=Daily Wear'
    },
    {
      name: 'Electronics',
      description: 'Sleek wireless charging mats, ambient smart lights, and desk chargers.',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
      count: electronicsCount,
      link: '/shop?category=Electronics'
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-primary/5 py-16 px-6 lg:px-16 border-b border-surface-container">
        <div className="max-w-7xl mx-auto">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 block">
            E-Store Collections
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Browse by Department
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed">
            Select a specialized department below to browse our thoroughly vetted and designed range of minimalist lifestyle essentials.
          </p>
        </div>
      </section>

      {/* Categories Listing */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.link}
              className="group relative overflow-hidden rounded-3xl min-h-[400px] shadow-level2 hover:shadow-level3 transition-all duration-500 bg-white flex flex-col justify-end"
            >
              {/* Backing Image */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-500 z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Counts Badge */}
              <div className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm font-bold text-xs">
                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                <span className="text-on-surface">
                  {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Text details overlay */}
              <div className="p-8 relative z-20">
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-2.5">
                  {cat.name}
                  <ArrowRight className="w-4.5 h-4.5 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </h2>
                <p className="text-white/80 text-xs leading-relaxed mb-6">
                  {cat.description}
                </p>
                <span className="inline-block px-4 py-2 bg-white text-on-surface text-xs font-bold rounded-xl transition-all shadow-sm group-hover:bg-primary group-hover:text-white">
                  Explore Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}

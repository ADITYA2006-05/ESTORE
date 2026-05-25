import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ArrowRight, 
  ShoppingBag, 
  Shirt, 
  Sparkles, 
  Home as HomeIcon, 
  Soup, 
  Footprints, 
  Cpu 
} from 'lucide-react'

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
      count: apparelCount,
      link: '/shop?category=Apparel',
      icon: Shirt,
      color: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-300'
    },
    {
      name: 'Accessories',
      description: 'Titanium chronographs, handcrafted leather backpacks, and UV sunglasses.',
      count: accessoriesCount,
      link: '/shop?category=Accessories',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300'
    },
    {
      name: 'Home',
      description: 'Handcrafted ceramic dishware, linen bedding, and workspace organizers.',
      count: homeCount,
      link: '/shop?category=Home',
      icon: HomeIcon,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300'
    },
    {
      name: 'Food',
      description: 'Artisan green tea collections, organic cold-pressed oils, and pantry botanicals.',
      count: foodCount,
      link: '/shop?category=Food',
      icon: Soup,
      color: 'bg-teal-50 text-teal-600 border-teal-100 hover:border-teal-300'
    },
    {
      name: 'Daily Wear',
      description: 'Ultra-soft socks, casual loungewear robes, and luxury walking sneakers.',
      count: dailyWearCount,
      link: '/shop?category=Daily Wear',
      icon: Footprints,
      color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300'
    },
    {
      name: 'Electronics',
      description: 'Sleek wireless charging mats, ambient smart lights, and desk chargers.',
      count: electronicsCount,
      link: '/shop?category=Electronics',
      icon: Cpu,
      color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300'
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
          <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed font-medium">
            Select a specialized department below to browse our thoroughly vetted and designed range of minimalist lifestyle essentials.
          </p>
        </div>
      </section>

      {/* Categories Listing */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.name}
                href={cat.link}
                className="group relative overflow-hidden rounded-3xl border border-surface-container bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[260px]"
              >
                {/* Decorative background glow on card hover */}
                <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Section: Icon and Counts */}
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl border transition-all duration-300 ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="bg-background border border-surface-container px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs">
                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    <span className="text-on-surface-variant">
                      {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Name, Description and Actions */}
                <div className="mt-8 space-y-3">
                  <h2 className="text-2xl font-extrabold text-on-surface tracking-tight flex items-center gap-2 group-hover:text-primary transition-colors">
                    {cat.name}
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                  </h2>
                  <p className="text-on-surface-variant text-xs leading-relaxed font-medium">
                    {cat.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </main>
  )
}

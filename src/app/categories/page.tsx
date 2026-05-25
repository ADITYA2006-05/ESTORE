import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
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
  let allProducts: any[] = []
  try {
    // Fetch all products to group them by category in a single query
    allProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to query products from DB:', error)
  }

  const categoryDefinitions = [
    {
      name: 'Apparel',
      description: 'Linen garments, organic cotton basics, and relaxed-fit designer wear.',
      icon: Shirt,
      color: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-300',
      link: '/shop?category=Apparel'
    },
    {
      name: 'Accessories',
      description: 'Titanium chronographs, handcrafted leather backpacks, and UV sunglasses.',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300',
      link: '/shop?category=Accessories'
    },
    {
      name: 'Home',
      description: 'Handcrafted ceramic dishware, linen bedding, and workspace organizers.',
      icon: HomeIcon,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300',
      link: '/shop?category=Home'
    },
    {
      name: 'Food',
      description: 'Artisan green tea collections, organic cold-pressed oils, and pantry botanicals.',
      icon: Soup,
      color: 'bg-teal-50 text-teal-600 border-teal-100 hover:border-teal-300',
      link: '/shop?category=Food'
    },
    {
      name: 'Daily Wear',
      description: 'Ultra-soft socks, casual loungewear robes, and luxury walking sneakers.',
      icon: Footprints,
      color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300',
      link: '/shop?category=Daily Wear'
    },
    {
      name: 'Electronics',
      description: 'Sleek wireless charging mats, ambient smart lights, and desk chargers.',
      icon: Cpu,
      color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300',
      link: '/shop?category=Electronics'
    }
  ]

  // Map products to categories and limit to the first 4 for display in the grid
  const categoriesData = categoryDefinitions.map((cat) => {
    const catProducts = allProducts.filter(
      (p) => p.category.toLowerCase() === cat.name.toLowerCase()
    )
    return {
      ...cat,
      count: catProducts.length,
      // Display the first 4 products in a beautifully synchronized grid row
      displayProducts: catProducts.slice(0, 4)
    }
  })

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-primary/5 py-16 px-6 lg:px-16 border-b border-surface-container">
        <div className="max-w-7xl mx-auto">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 block">
            Store Departments
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Bespoke Vertical Catalog
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed font-medium">
            Explore our specialized departments listed vertically, featuring synchronized product grids for immediate and seamless browsing.
          </p>
        </div>
      </section>

      {/* Categories Vertical Stack Section */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1 space-y-24">
        {categoriesData.map((cat) => {
          const Icon = cat.icon
          return (
            <div 
              key={cat.name} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-surface-container/60 last:border-b-0"
            >
              {/* Left Column: Category Description Card (Spans 4) */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-surface-container p-8 rounded-3xl shadow-sm h-fit">
                <div className="space-y-6">
                  {/* Icon and live count */}
                  <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl border ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="bg-background border border-surface-container px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs">
                      <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                      <span className="text-on-surface-variant">
                        {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="space-y-3">
                    <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">
                      {cat.name}
                    </h2>
                    <p className="text-on-surface-variant text-xs leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-8">
                  <Link 
                    href={cat.link}
                    className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 group transition-all"
                  >
                    View All Products
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Synchronized Product Grid (Spans 8) */}
              <div className="lg:col-span-8 flex flex-col justify-center">
                {cat.displayProducts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-surface-container/60">
                    <p className="text-on-surface-variant text-xs font-semibold">No active products in this category.</p>
                  </div>
                ) : (
                  /* Syncing grid layout sizing with the main catalog shop grids */
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cat.displayProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                        category={product.category}
                        stock={product.stock}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </section>

      <Footer />
    </main>
  )
}

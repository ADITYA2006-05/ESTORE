import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'
import { Sparkles, Calendar } from 'lucide-react'

export const revalidate = 0 // Always get fresh data

export default async function NewArrivals() {
  let products: any[] = []
  let error = false

  try {
    // Fetch products ordered by createdAt desc to show newest first
    products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (err) {
    console.error('Failed to load new products', err)
    error = true
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-primary/5 py-20 px-6 lg:px-16 border-b border-surface-container relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full text-xs font-bold text-secondary mb-4 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Fresh Arrivals
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            New Collections
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto leading-relaxed">
            Stay ahead of the curve. Explore our latest arrivals, featuring clean silhouettes, premium fabrics, and advanced minimalist design logic.
          </p>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        {error ? (
          <div className="py-20 text-center max-w-sm mx-auto">
            <p className="text-red-500 font-semibold mb-2">Error Connection Failure</p>
            <p className="text-on-surface-variant text-sm">Failed to establish connection to the database. Please verify your connection status.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-white border border-surface-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Calendar className="w-6 h-6 text-on-surface-variant" />
            </div>
            <h3 className="text-xl font-bold mb-2">No New Arrivals</h3>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              We currently do not have any new products in our catalog. Check back soon for our upcoming summer releases!
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-10 flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Showing the latest {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
              <div className="h-px bg-surface-container flex-1 mx-6 hidden sm:block" />
              <span className="text-xs text-primary font-bold hidden sm:block">UPDATED CONSTANTLY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  {/* Decorative badge overlay */}
                  <div className="absolute top-4 right-4 z-20 bg-secondary text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-secondary/20 pointer-events-none">
                    New
                  </div>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    stock={product.stock}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

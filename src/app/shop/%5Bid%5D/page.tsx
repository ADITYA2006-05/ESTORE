'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Check, 
  RefreshCw, 
  Truck, 
  ShieldCheck, 
  Leaf 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params)

  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        // 1. Fetch current product details
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)

          // 2. Fetch all products to filter recommendations by category
          const allRes = await fetch('/api/products')
          if (allRes.ok) {
            const allProducts: Product[] = await allRes.json()
            // Filter other products in the same category (limit to 4)
            const filtered = allProducts
              .filter((p) => p.category === data.category && p.id !== data.id)
              .slice(0, 4)
            setRecommendations(filtered)
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock
    })
    
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs font-semibold text-on-surface-variant">Unveiling product details...</span>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24 px-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-16 h-16 bg-[#f7e8e4] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <ShoppingBag className="w-6 h-6 text-[#c86348]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Product Not Found</h1>
            <p className="text-on-surface-variant text-sm font-medium">
              We couldn't retrieve the specifications for this item. It might have been retired from our catalog or entered incorrectly.
            </p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 group shadow-sm transition-all">
              <ArrowLeft className="w-4 h-4 text-white" />
              Return to Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Product Showcase */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        {/* Back navigation */}
        <div className="mb-10">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop Catalog
          </Link>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Padded Framed Image Product Showcase (Spans 6) */}
          <div className="lg:col-span-6 bg-white border border-surface-container rounded-[2rem] p-8 shadow-sm flex items-center justify-center aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-square relative overflow-hidden">
            <div className="absolute inset-0 bg-[#faf8f5]/60 z-0" />
            <img 
              src={product.image} 
              alt={product.name}
              className="object-contain w-full h-full max-h-[440px] z-10 drop-shadow-md select-none transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Right Column: Dynamic Human-Made Storytelling & Controls (Spans 6) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-4">
              {/* Category and stock tag */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-[#f7e8e4] text-[#7d3421] border border-[#c86348]/20 text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm">
                  {product.category}
                </span>

                {product.stock === 0 ? (
                  <span className="bg-red-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm">
                    Sold Out
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="bg-[#c86348] text-white text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm">
                    Only {product.stock} Left!
                  </span>
                ) : (
                  <span className="bg-primary text-white text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm">
                    In Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-normal leading-[1.1] text-on-surface">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-3xl font-extrabold text-secondary tracking-tight">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            {/* Separator line */}
            <div className="border-t border-surface-container/60 my-6" />

            {/* Product Description Narrative */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                About the Design Composition
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Interactive add to cart controls */}
            <div className="pt-4 space-y-4">
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="w-full sm:w-auto btn-primary px-10 py-4.5 rounded-2xl flex items-center justify-center gap-3 font-bold text-base shadow-md hover:shadow-lg disabled:opacity-90 cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span 
                        key="check"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-5 h-5 text-white" />
                        Added to Shopping Cart!
                      </motion.span>
                    ) : (
                      <motion.span 
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5 text-white" />
                        Add to Shopping Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto px-10 py-4.5 bg-neutral-200 text-neutral-400 rounded-2xl font-bold text-base cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

            {/* Separator line */}
            <div className="border-t border-surface-container/60 my-6" />

            {/* Trust highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0 text-primary">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider block">Free Delivery</h4>
                  <span className="text-[10px] font-medium text-on-surface-variant block mt-0.5">Complementary global transport</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0 text-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider block">Handcrafted Guarantee</h4>
                  <span className="text-[10px] font-medium text-on-surface-variant block mt-0.5">Vetted master craftsmanship</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0 text-primary">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider block">Eco Sourcing</h4>
                  <span className="text-[10px] font-medium text-on-surface-variant block mt-0.5">Organic, sustainable fibers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Recommendation Panel */}
      {recommendations.length > 0 && (
        <section className="bg-white border-t border-surface-container py-24 px-6 lg:px-16 w-full text-left">
          <div className="max-w-7xl mx-auto space-y-12">
            <div>
              <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 block">
                Related Essentials
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                You May Also Like
              </h2>
            </div>

            {/* Synced Grid Layout matching the main catalog */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recommendations.map((rec) => (
                <ProductCard
                  key={rec.id}
                  id={rec.id}
                  name={rec.name}
                  price={rec.price}
                  image={rec.image}
                  category={rec.category}
                  stock={rec.stock}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

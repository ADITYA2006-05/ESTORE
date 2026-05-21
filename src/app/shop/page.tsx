'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ArrowUpDown, RefreshCw, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

function ShopContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured') // 'featured', 'price-low-high', 'price-high-low'

  // Fetch products from our DB API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error('Failed to load products', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Sync category state with search parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    } else {
      setSelectedCategory('All')
    }
  }, [categoryParam])

  // Filter and Sort logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'All' || 
                              product.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'price-low-high') {
        return a.price - b.price
      }
      if (sortBy === 'price-high-low') {
        return b.price - a.price
      }
      return 0 // default 'featured' / insertion order
    })

  const categories = ['All', 'Apparel', 'Accessories', 'Home', 'Food', 'Daily Wear', 'Electronics']

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-primary/5 py-16 px-6 lg:px-16 border-b border-surface-container">
        <div className="max-w-7xl mx-auto">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 block">
            Minimalist Catalog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Shop the Collection
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed">
            Discover a curated collection of clothing, design accessories, and home items designed to provide utility and absolute aesthetic harmony.
          </p>
        </div>
      </section>

      {/* Catalog Grid and Filters */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        {/* Control Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 pb-6 border-b border-surface-container">
          {/* Categories slider */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all flex-shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white border border-surface-container text-on-surface hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search and Sort panel */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-surface-container rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Sort Panel */}
            <div className="relative w-full sm:w-auto flex-shrink-0 flex items-center gap-2 border border-surface-container rounded-full px-4 py-2 bg-white text-sm">
              <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 focus:ring-0 focus:outline-none font-semibold text-xs cursor-pointer text-on-surface pr-4"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Output */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-on-surface-variant text-sm font-semibold">Loading carefully selected catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-white border border-surface-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-6 h-6 text-on-surface-variant" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Products Found</h3>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              We couldn't find any products matching your current category, search query, or sorting criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSortBy('featured')
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          >
            {filteredProducts.map((product) => (
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
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default function Shop() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs font-semibold text-on-surface-variant">Synchronizing store catalog...</span>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <ShopContent />
    </Suspense>
  )
}

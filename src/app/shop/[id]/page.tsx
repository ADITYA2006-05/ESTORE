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
  Leaf,
  Star,
  MessageSquare,
  Sparkles,
  ClipboardList
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

interface Review {
  author: string
  initials: string
  rating: number
  title: string
  body: string
  date: string
}

// Deterministic specifications list based on product category
const getSpecsByCategory = (category: string) => {
  const specs = {
    'Apparel': [
      { label: 'Sourcing & Materials', value: '100% Organic Linen / Long-staple Combed Cotton' },
      { label: 'Fabric Density', value: '180 GSM (Lightweight, breathable luxury weave)' },
      { label: 'Origin of Sourcing', value: 'Hand-woven in Maheshwar, India' },
      { label: 'Garment Fit', value: 'Relaxed Humanist drape with reinforced flatlock seams' },
      { label: 'Care Instructions', value: 'Machine wash cold on gentle, line dry in shade' }
    ],
    'Accessories': [
      { label: 'Sourcing & Materials', value: 'Full-grain vegetable-tanned leather / Waxed cotton canvas' },
      { label: 'Hardware Composition', value: 'Custom-brushed titanium rivets & aerospace-grade zippers' },
      { label: 'Origin of Sourcing', value: 'Hand-sewn in Kanpur, India' },
      { label: 'Dimensions', value: '11.0 cm x 8.5 cm x 1.5 cm (Slim profile carry)' },
      { label: 'Features', value: 'Equipped with integrated RFID blocking protection' }
    ],
    'Home': [
      { label: 'Sourcing & Materials', value: 'Organic stoneware river clay / FSC-certified Oak wood' },
      { label: 'Finishing Glaze', value: 'Matte lead-free food-safe mineral glaze' },
      { label: 'Origin of Sourcing', value: 'Hand-thrown in Khurja, Uttar Pradesh' },
      { label: 'Care & Use', value: 'Dishwasher, microwave, and food safe' },
      { label: 'Acoustics & Grip', value: 'Ergonomic handle loop with raw insulated unglazed base' }
    ],
    'Food': [
      { label: 'Sourcing & Materials', value: '100% Organically grown single-origin plants' },
      { label: 'Quality Grade', value: 'Premium ceremonial grade / Small-batch certified' },
      { label: 'Origin of Sourcing', value: 'Harvested in organic estates of Darjeeling, India' },
      { label: 'Shelf Life', value: '12 months from packing (Preserved in nitrogen flushed jars)' },
      { label: 'Dietary Info', value: 'Vegan, gluten-free, sugar-free, completely natural' }
    ],
    'Daily Wear': [
      { label: 'Sourcing & Materials', value: '85% Fine Merino Wool, 15% Bamboo Lyocell' },
      { label: 'Weave Resiliency', value: 'Ultra-cushioned loop pile with high elastic recovery' },
      { label: 'Origin of Sourcing', value: 'Spun and knitted in Ludhiana, Punjab' },
      { label: 'Temperature Controls', value: 'Active thermal thermoregulation and moisture-wicking' },
      { label: 'Care Instructions', value: 'Machine wash gentle inside out, flat dry' }
    ],
    'Electronics': [
      { label: 'Sourcing & Materials', value: 'Anodized sandblasted aluminum / Organic bamboo plate' },
      { label: 'Charging Standards', value: '15W Qi-certified induction coils for rapid transfers' },
      { label: 'Origin of Assembly', value: 'Assembled in electronics hubs of Bengaluru, India' },
      { label: 'Dimensions & Weight', value: '9.0 cm diameter x 0.8 cm thickness (120 grams)' },
      { label: 'Safety Protections', value: 'Built-in overcurrent, heat safeguards, and sleep auto-off' }
    ]
  }
  return specs[category as keyof typeof specs] || specs['Apparel']
}

// Deterministic reviews generator based on product ID
const getMockReviews = (productId: string, category: string): Review[] => {
  const charSum = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  const reviewers = [
    { name: 'Aarav Sharma', avatar: 'AS' },
    { name: 'Meera Krishnan', avatar: 'MK' },
    { name: 'Vikram Roy', avatar: 'VR' },
    { name: 'Ananya Patel', avatar: 'AP' },
    { name: 'Kabir Sen', avatar: 'KS' },
    { name: 'Diya Nair', avatar: 'DN' }
  ]
  
  const reviewsPool = {
    'Apparel': [
      { title: 'Exquisite weave & weight', body: 'The organic texture is absolutely beautiful. The linen drape is heavy enough to feel premium but light enough for warm weather. Incredibly pleasant!', rating: 5 },
      { title: 'Superb casual elegance', body: 'Fits like a dream! I love that you can dress it up or down. You can clearly feel the skilled human workmanship in the stitching.', rating: 5 },
      { title: 'Incredibly soft and comfortable', body: 'After the first wash, the cotton became even softer. The color is deep and natural. Strongly recommend!', rating: 4 }
    ],
    'Accessories': [
      { title: 'Artisanal leather quality', body: 'The leather smells wonderful and the vegetable tanning is perfect. It fits all my essentials while remaining remarkably slim. Sleek and elegant.', rating: 5 },
      { title: 'A true designer masterpiece', body: 'Every stitch is flawless. The metal hardware has a heavy, satisfying brushed premium feel. An exceptional addition to my daily carry.', rating: 5 },
      { title: 'Minimalist carry perfection', body: 'Compact and light. The key organizer keeps everything quiet and protected. Terrific craftsmanship!', rating: 4 }
    ],
    'Home': [
      { title: 'Stunning handmade detail', body: 'The matte finish on the clay is so pleasant to hold. It adds a peaceful, organic touch to my kitchen desk setup. A work of art!', rating: 5 },
      { title: 'Remarkable durability & style', body: 'Dishwasher and microwave safe, and it still looks pristine. The glaze is absolutely lead-free and has a beautiful depth.', rating: 5 },
      { title: 'Perfect modern organizer', body: 'Reduces clutter immediately. The oak wood has a beautiful soft grain and smells amazing. Very happy!', rating: 4 }
    ],
    'Food': [
      { title: 'Pure, authentic aroma', body: 'The matcha is bright green and has a lovely smooth umami flavor with zero bitterness. Best single-origin tea I have ever had.', rating: 5 },
      { title: 'Freshly roasted bliss', body: 'The coffee beans arrived beautifully fresh and roasted to perfection. The packaging keeps it entirely airtight. 10/10.', rating: 5 },
      { title: 'Deep, rich organic flavor', body: 'The maple syrup has a lovely woodsy sweetness. Absolutely natural and delicious in morning bowls.', rating: 4 }
    ],
    'Daily Wear': [
      { title: 'Like walking on clouds', body: 'The cushioning in the sole is incredible. Merino wool keeps my feet entirely warm and fresh throughout active days.', rating: 5 },
      { title: 'Cozy lounging essential', body: 'Perfect fit and incredibly light. It feels non-restrictive and has quickly become my go-to evening comfort robe.', rating: 5 },
      { title: 'Exceptional weave resilience', body: 'The socks set retains its shape perfectly even after multiple hot washes. Excellent reinforcement at heels.', rating: 4 }
    ],
    'Electronics': [
      { title: 'Flawless charging speed', body: 'The Qi fast charger works perfectly through my thick phone case. The aluminum base keeps it cold and looks gorgeous on my desk.', rating: 5 },
      { title: 'Breathtaking sound clarity', body: 'The acoustic balance is outstanding. Warm mids and clear highs without any distortion. Sleek and battery life is massive.', rating: 5 },
      { title: 'Extremely neat workspace item', body: 'Cable clutter is gone! The smart plug is highly responsive and links seamlessly with my home setups.', rating: 4 }
    ]
  }

  const idx1 = charSum % reviewers.length
  const idx2 = (charSum + 1) % reviewers.length
  const idx3 = (charSum + 2) % reviewers.length
  
  const pool = reviewsPool[category as keyof typeof reviewsPool] || reviewsPool['Apparel']
  
  return [
    { ...pool[0], author: reviewers[idx1].name, initials: reviewers[idx1].avatar, date: 'October 14, 2025' },
    { ...pool[1], author: reviewers[idx2].name, initials: reviewers[idx2].avatar, date: 'November 02, 2025' },
    { ...pool[2], author: reviewers[idx3].name, initials: reviewers[idx3].avatar, date: 'December 28, 2025' }
  ]
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  
  // Tabs management
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')

  // Review states
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
          
          // Seed reviews deterministically
          setReviews(getMockReviews(data.id, data.category))

          const allRes = await fetch('/api/products')
          if (allRes.ok) {
            const allProducts: Product[] = await allRes.json()
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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName || !reviewTitle || !reviewBody) {
      alert('Please fill in all the review fields.')
      return
    }

    const getInitials = (name: string) => {
      return name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'R'
    }

    const newReview: Review = {
      author: reviewName,
      initials: getInitials(reviewName),
      rating: reviewRating,
      title: reviewTitle,
      body: reviewBody,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    setReviews([newReview, ...reviews])
    setReviewName('')
    setReviewTitle('')
    setReviewBody('')
    setReviewRating(5)
    setReviewSuccess(true)
    setTimeout(() => setReviewSuccess(false), 3000)
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
              We couldn't retrieve the specifications for this item. It might have been retired from our catalog.
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

  const specifications = getSpecsByCategory(product.category)
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Column: Padded Framed Image Showcase (Spans 6) */}
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
              {/* Category, Rating, and stock tags */}
              <div className="flex flex-wrap gap-3 items-center">
                <span className="bg-[#f7e8e4] text-[#7d3421] border border-[#c86348]/20 text-[9px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 bg-[#faf8f5] border border-surface-container px-2.5 py-1 rounded-lg shadow-sm text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-on-surface">{averageRating}</span>
                  <span className="text-on-surface-variant/55 font-bold">({reviews.length})</span>
                </div>

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

        {/* Tabbed details section (Specifications vs Customer Reviews) */}
        <div className="border border-surface-container bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm text-left mb-24 animate-fadeIn">
          {/* Tab buttons */}
          <div className="flex gap-4 border-b border-surface-container/60 pb-4 mb-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-5 py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'details'
                  ? 'bg-[#f7e8e4] text-[#7d3421] border border-[#c86348]/20 shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Design Details
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-[#f7e8e4] text-[#7d3421] border border-[#c86348]/20 shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Verified Reviews ({reviews.length})
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'details' ? (
              <motion.div
                key="details-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-secondary" />
                  Product Specifications & Sourcing Sheet
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl font-medium">
                  We believe absolute transparency is essential. Below are the vetted specifications, sourcing locations, and care requirements for this piece.
                </p>

                {/* Table representation */}
                <div className="border border-surface-container rounded-2xl overflow-hidden max-w-3xl">
                  {specifications.map((spec, i) => (
                    <div 
                      key={i} 
                      className={`grid grid-cols-1 sm:grid-cols-3 p-4 border-b border-surface-container/60 last:border-b-0 text-xs font-semibold ${
                        i % 2 === 0 ? 'bg-[#faf8f5]/40' : 'bg-white'
                      }`}
                    >
                      <span className="text-on-surface-variant font-extrabold">{spec.label}</span>
                      <span className="sm:col-span-2 text-on-surface mt-1 sm:mt-0 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reviews-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
              >
                {/* Left Reviews List Panel (Spans 7) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between border-b border-surface-container/60 pb-4 mb-2">
                    <h3 className="text-lg font-extrabold tracking-tight">Verified Buyer Feedback</h3>
                    <span className="text-xs font-bold text-on-surface-variant bg-[#faf8f5] px-3 py-1 rounded-lg border border-surface-container">
                      Based on {reviews.length} reviews
                    </span>
                  </div>

                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-3 scrollbar-none">
                    {reviews.map((rev, i) => (
                      <div 
                        key={i} 
                        className="p-5 border border-surface-container rounded-2xl bg-[#faf8f5]/25 hover:border-secondary/20 hover:bg-[#faf8f5]/50 transition-all flex items-start gap-4 animate-scaleIn"
                      >
                        {/* Initials avatar */}
                        <div className="w-10 h-10 rounded-xl bg-primary text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm select-none">
                          {rev.initials}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 flex-grow min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-extrabold text-sm block truncate">{rev.author}</span>
                              <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider mt-0.5">Verified Buyer</span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-medium">{rev.date}</span>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-0.5 pt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating 
                                    ? 'text-amber-500 fill-amber-500' 
                                    : 'text-neutral-200'
                                }`} 
                              />
                            ))}
                          </div>

                          <h4 className="font-extrabold text-xs text-on-surface">{rev.title}</h4>
                          <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                            {rev.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Write a Review Panel (Spans 5) */}
                <div className="lg:col-span-5 bg-[#faf8f5] border border-surface-container rounded-2xl p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight">Share Your Experience</h3>
                    <p className="text-[10px] font-semibold text-on-surface-variant leading-relaxed mt-1">
                      Have you used this piece? Submit an review to inform the designer team and other consumers.
                    </p>
                  </div>

                  {reviewSuccess && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl animate-fadeIn">
                      🎉 Thank you! Your verified review has been published below.
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {/* Name */}
                    <div className="space-y-1.5 text-left">
                      <label className="block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Aditya G."
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full bg-white border border-surface-container rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-secondary transition-colors text-on-surface"
                      />
                    </div>

                    {/* Star Rating Selection */}
                    <div className="space-y-1.5 text-left">
                      <label className="block">Score Rating</label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            className="p-1 rounded hover:bg-white transition-colors cursor-pointer"
                          >
                            <Star 
                              className={`w-6 h-6 transition-all ${
                                s <= reviewRating 
                                  ? 'text-amber-500 fill-amber-500 hover:scale-110' 
                                  : 'text-neutral-300 hover:text-amber-400'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div className="space-y-1.5 text-left">
                      <label className="block">Review Summary Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Stunning craftsmanship!"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full bg-white border border-surface-container rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-secondary transition-colors text-on-surface"
                      />
                    </div>

                    {/* Review Body */}
                    <div className="space-y-1.5 text-left">
                      <label className="block">Detailed Feedback</label>
                      <textarea
                        required
                        placeholder="How is the texture, material weight, output durability, or daily fit?"
                        rows={4}
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        className="w-full bg-white border border-surface-container rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-secondary transition-colors resize-none text-on-surface"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full btn-primary py-3.5 rounded-xl cursor-pointer font-bold text-xs uppercase tracking-widest text-white shadow-sm"
                    >
                      Publish Verification Review
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Plus, Trash2, LogOut, Package, RefreshCw, Sparkles, Image as ImageIcon, IndianRupee, Tag, FileText, Upload } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export default function Admin() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Form Fields
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Apparel')
  const [stock, setStock] = useState('10')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [dragActive, setDragActive] = useState(false)

  // Drag and drop image handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit to keep DB lightweight
      setErrorMsg('Image size must be less than 2MB.')
      return
    }
    setErrorMsg('')
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Protect route
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('estore_admin_logged_in') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      setAuthorized(true)
      fetchProducts()
    }
  }, [])

  // Fetch products
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

  // Handle product addition
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    if (!name || !price || !image || !category || stock === undefined || stock === '') {
      setErrorMsg('Please fill in all required fields.')
      setSubmitting(false)
      return
    }

    try {
      const parsedPrice = parseFloat(price)
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        setErrorMsg('Please enter a valid price.')
        setSubmitting(false)
        return
      }

      const parsedStock = parseInt(stock)
      if (isNaN(parsedStock) || parsedStock < 0) {
        setErrorMsg('Please enter a valid non-negative stock quantity.')
        setSubmitting(false)
        return
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parsedPrice,
          category,
          stock: parsedStock,
          image,
          description: description || `Hand-selected premium ${name} designed for optimal style and function.`
        })
      })

      if (res.ok) {
        setSuccessMsg(`"${name}" successfully added to the catalog!`)
        setName('')
        setPrice('')
        setCategory('Apparel')
        setStock('10')
        setDescription('')
        setImage('')
        fetchProducts() // refresh list
      } else {
        setErrorMsg('Failed to create product in DB.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to API.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle product deletion
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('estore_admin_logged_in')
    router.push('/login')
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-primary/5 py-12 px-6 lg:px-16 border-b border-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-1 block">
              Control Panel
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Product Database Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        </div>
      </section>

      {/* Core Grid */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Add Product Form Column (Left 5) */}
          <div className="lg:col-span-5 bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm h-fit">
            <h2 className="text-2xl font-extrabold mb-6 tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Add New Product
            </h2>

            {successMsg && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-xl">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Product Name *
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Minimalist Leather Strap..."
                    className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Price / Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                     Price (INR) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="120.00"
                      className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Stock Quantity *
                  </label>
                  <div className="relative">
                    <Package className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="0"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Category *
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium cursor-pointer"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home">Home</option>
                    <option value="Food">Food</option>
                    <option value="Daily Wear">Daily Wear</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>

              {/* Image Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Product Image *
                </label>
                
                {image ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-surface-container/60 aspect-video bg-background flex items-center justify-center p-2">
                    <img src={image} alt="Upload preview" className="object-contain w-full h-full max-h-[160px]" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-container hover:border-primary/50 bg-background/50'
                    }`}
                    onClick={() => document.getElementById('image-upload-input')?.click()}
                  >
                    <input
                      type="file"
                      id="image-upload-input"
                      accept="image/*"
                      required
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Upload className="w-8 h-8 text-on-surface-variant/40 animate-pulse" />
                    <div>
                      <span className="text-xs font-bold text-primary">Click to upload</span>
                      <span className="text-xs text-on-surface-variant font-medium"> or drag & drop</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/40 font-semibold uppercase tracking-wider">
                      PNG, JPG, WEBP up to 2MB
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Description
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-4" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain specifications, dimensions, material compositions..."
                    rows={4}
                    className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Pushing to Database...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Product to Catalog
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Current Catalog Table Column (Right 7) */}
          <div className="lg:col-span-7 bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm flex flex-col min-h-[500px]">
            <h2 className="text-2xl font-extrabold mb-6 tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Database Inventory
              <span className="bg-background text-on-surface text-xs font-extrabold px-2.5 py-0.5 rounded-full ml-auto">
                {products.length} Items
              </span>
            </h2>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                <span className="text-xs font-semibold text-on-surface-variant">Connecting inventory...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto">
                <Package className="w-12 h-12 text-on-surface-variant/30 mb-4" />
                <h3 className="font-bold text-base mb-1">Catalog Empty</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  No active products are available in the database. Use the form on the left to push new entries.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[560px] pr-2 space-y-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 p-4 border border-surface-container/60 rounded-2xl hover:border-primary/30 hover:bg-background/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-background overflow-hidden relative flex-shrink-0">
                      <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-on-surface group-hover:text-primary transition-colors">
                        {p.name}
                      </h4>
                      <div className="flex items-center flex-wrap gap-2.5 mt-1.5 text-xs text-on-surface-variant font-medium">
                        <span className="px-2 py-0.5 bg-background border border-surface-container rounded-md">
                          {p.category}
                        </span>
                        <span>₹{p.price.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 rounded-md border font-semibold text-[10px] uppercase tracking-wider ${
                          p.stock === 0 
                            ? 'bg-red-50 text-red-600 border-red-100' 
                            : p.stock <= 5 
                              ? 'bg-amber-50 text-amber-600 border-amber-100' 
                              : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

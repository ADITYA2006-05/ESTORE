'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  Plus, 
  Trash2, 
  LogOut, 
  Package, 
  RefreshCw, 
  Sparkles, 
  Image as ImageIcon, 
  IndianRupee, 
  Tag, 
  FileText, 
  Upload, 
  ShoppingBag, 
  Eye, 
  Calendar, 
  MapPin, 
  Mail, 
  User as UserIcon, 
  Clock, 
  Truck, 
  CheckCircle,
  ChevronDown
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  userId: string | null
  customerName: string
  customerEmail: string
  shippingAddress: string
  zipCode: string
  totalAmount: number
  status: string
  items: OrderItem[]
  createdAt: string
}

export default function Admin() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory')
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

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
      fetchOrders()
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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      console.error('Failed to load orders', err)
    } finally {
      setOrdersLoading(false)
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

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      } else {
        alert('Failed to update order status')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Error connecting to servers')
    } finally {
      setUpdatingOrderId(null)
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

  // Calculate order stats dynamically
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0)
  const placedCount = orders.filter(o => o.status === 'Placed').length
  const processingCount = orders.filter(o => o.status === 'Processing').length
  const transitCount = orders.filter(o => o.status === 'In Transit').length
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length

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
              {activeTab === 'inventory' ? 'Inventory Database Dashboard' : 'Customer Orders Control Panel'}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Tabs */}
            <div className="bg-surface-container/60 p-1.5 rounded-2xl border border-surface-container flex gap-1">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'inventory'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Inventory Manager
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders')
                  fetchOrders()
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Orders Monitor
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ml-1">
                  {orders.length}
                </span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors text-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              End Session
            </button>
          </div>
        </div>
      </section>

      {/* Core Grid */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        
        {activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-surface-container">
            
            {/* Add Product Form Column (Left 5) */}
            <div className="lg:col-span-5 bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm h-fit">
              <h2 className="text-2xl font-extrabold mb-6 tracking-tight flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Product
              </h2>

              {successMsg && (
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-xl animate-fadeIn">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl animate-fadeIn">
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
                      className="flex items-center gap-4 p-4 border border-surface-container/60 rounded-2xl hover:border-primary/30 hover:bg-background/20 transition-all group animate-scaleIn"
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
        ) : (
          <div className="space-y-12">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white border border-surface-container/60 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Total Revenue</span>
                <span className="text-xl font-black text-primary mt-1 block">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="bg-white border border-surface-container/60 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Placed Orders</span>
                <span className="text-xl font-black text-blue-600 mt-1 block">{placedCount} Placed</span>
              </div>
              <div className="bg-white border border-surface-container/60 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">In Processing</span>
                <span className="text-xl font-black text-amber-600 mt-1 block">{processingCount} Processing</span>
              </div>
              <div className="bg-white border border-surface-container/60 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">In Transit</span>
                <span className="text-xl font-black text-indigo-600 mt-1 block">{transitCount} Transit</span>
              </div>
              <div className="bg-white border border-surface-container/60 rounded-2xl p-5 shadow-sm col-span-2 md:col-span-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Completed</span>
                <span className="text-xl font-black text-green-600 mt-1 block">{deliveredCount} Delivered</span>
              </div>
            </div>

            {/* Orders Database Container */}
            <div className="bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm flex flex-col min-h-[500px]">
              <h2 className="text-2xl font-extrabold mb-6 tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Active Sales Pipeline
                <span className="bg-background text-on-surface text-xs font-extrabold px-2.5 py-0.5 rounded-full ml-auto">
                  {orders.length} Orders
                </span>
              </h2>

              {ordersLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-xs font-semibold text-on-surface-variant">Syncing real-time orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto">
                  <ShoppingBag className="w-12 h-12 text-on-surface-variant/30 mb-4 animate-pulse" />
                  <h3 className="font-bold text-base mb-1">No Orders Recorded</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    No orders have been completed yet. Once a customer checks out, the pipeline updates automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="border border-surface-container/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/25 transition-all animate-scaleIn bg-white text-left"
                    >
                      {/* Order Header Block */}
                      <div className="bg-primary/5 px-6 py-5 border-b border-surface-container/60 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black tracking-tight text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                              ORDER ID: {o.id.toUpperCase()}
                            </span>
                            <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-on-surface-variant/50" />
                              {new Date(o.createdAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {/* Client Information */}
                          <div className="flex items-center gap-3 text-xs text-on-surface font-semibold pt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3.5 h-3.5 text-secondary" />
                              {o.customerName}
                            </span>
                            <span className="text-on-surface-variant/30">|</span>
                            <span className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                              <Mail className="w-3.5 h-3.5" />
                              <a href={`mailto:${o.customerEmail}`}>{o.customerEmail}</a>
                            </span>
                            {o.userId ? (
                              <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 font-bold rounded text-[9px] uppercase tracking-widest">
                                Registered User
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 font-bold rounded text-[9px] uppercase tracking-widest">
                                Guest
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Pricing / Status controls */}
                        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-surface-container/60">
                          <div className="text-left lg:text-right">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Total Amount</span>
                            <span className="text-lg font-black text-primary">₹{o.totalAmount.toFixed(2)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {updatingOrderId === o.id ? (
                              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                            ) : (
                              <div className="relative">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className={`pl-3 pr-8 py-2 rounded-xl text-xs font-black border cursor-pointer appearance-none transition-all focus:outline-none ${
                                    o.status === 'Placed'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : o.status === 'Processing'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : o.status === 'In Transit'
                                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                          : 'bg-green-50 text-green-700 border-green-200'
                                  }`}
                                >
                                  <option value="Placed">Placed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="In Transit">In Transit</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items and Address Content Body */}
                      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white">
                        {/* Nested items (Left 8) */}
                        <div className="lg:col-span-8 space-y-4">
                          <h4 className="text-xs font-extrabold text-on-surface uppercase tracking-wider pb-1 border-b border-surface-container/60 flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-primary" />
                            Itemized Products List ({o.items.length})
                          </h4>
                          
                          <div className="space-y-3">
                            {o.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3.5 p-3 rounded-2xl border border-surface-container/40 hover:bg-background/20 transition-all"
                              >
                                <div className="w-10 h-10 rounded-xl bg-background border border-surface-container/40 overflow-hidden flex-shrink-0 relative">
                                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-xs truncate text-on-surface">
                                    {item.name}
                                  </h5>
                                  <span className="text-[10px] text-on-surface-variant font-medium mt-0.5 block">
                                    Product ID: {item.productId}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="font-bold text-xs block text-on-surface">
                                    ₹{item.price.toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-on-surface-variant font-semibold block">
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping and logistics block (Right 4) */}
                        <div className="lg:col-span-4 bg-background/50 border border-surface-container/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-extrabold text-on-surface uppercase tracking-wider pb-1 border-b border-surface-container/60 flex items-center gap-1.5 mb-3">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                              Logistics Destination
                            </h4>
                            <p className="text-xs font-medium text-on-surface leading-relaxed">
                              {o.shippingAddress}
                            </p>
                            <span className="inline-block mt-2 text-[10px] font-bold bg-white border border-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full">
                              ZIP: {o.zipCode}
                            </span>
                          </div>

                          <div className="pt-4 border-t border-surface-container/60 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                            <span>Status Pipeline:</span>
                            <span className="flex items-center gap-1 font-extrabold text-primary">
                              {o.status === 'Placed' && <Clock className="w-3.5 h-3.5 text-blue-500" />}
                              {o.status === 'Processing' && <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                              {o.status === 'In Transit' && <Truck className="w-3.5 h-3.5 text-indigo-500" />}
                              {o.status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                              {o.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

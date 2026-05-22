'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  ShoppingBag, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  RefreshCw, 
  Lock,
  ChevronRight,
  IndianRupee,
  HelpCircle
} from 'lucide-react'

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

export default function OrderHistory() {
  const router = useRouter()
  const [customerUser, setCustomerUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Load profile and verify session
  useEffect(() => {
    const stored = localStorage.getItem('estore_customer_user')
    if (stored) {
      try {
        const user = JSON.parse(stored)
        setCustomerUser(user)
        fetchCustomerOrders(user.id)
      } catch (err) {
        console.error('Session parsing failure:', err)
        setLoading(false)
        setAuthChecked(true)
      }
    } else {
      setLoading(false)
      setAuthChecked(true)
    }
  }, [])

  // Fetch orders matching specific customer ID
  const fetchCustomerOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      console.error('Failed to load customer orders:', err)
    } finally {
      setLoading(false)
      setAuthChecked(true)
    }
  };

  // Preloader
  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm font-semibold text-on-surface-variant animate-pulse">Syncing purchase history...</span>
        </div>
        <Footer />
      </main>
    )
  }

  // Not Logged In State
  if (!customerUser && authChecked) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-surface-container/60 rounded-3xl p-8 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10">
              <Lock className="w-6 h-6 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-on-surface">Access Protected History</h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Please sign in to your ESTORE account to view your past orders, trace active shipments, and manage receipts securely.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link 
                href="/login?redirect=/orders"
                className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
              >
                Sign In to Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/shop"
                className="w-full py-3 rounded-xl border border-surface-container hover:bg-background text-on-surface-variant font-bold text-xs transition-colors cursor-pointer block"
              >
                Return to Shop Catalog
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-primary/5 py-12 px-6 lg:px-16 border-b border-surface-container">
        <div className="max-w-4xl mx-auto">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-1 block">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Your Purchase History
          </h1>
          <p className="text-xs text-on-surface-variant mt-1.5 font-medium leading-relaxed">
            Manage your personal order records, monitor real-time fulfillment pipelines, and request instant help below.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 py-16 px-6 lg:px-16 max-w-4xl mx-auto w-full">
        {orders.length === 0 ? (
          <div className="bg-white border border-surface-container/60 rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10">
              <ShoppingBag className="w-6 h-6 text-primary animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold tracking-tight">No Purchases Found</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                It looks like you haven't placed any orders with this account yet. Let's find your first premium addition to the collection!
              </p>
            </div>

            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Start Exploring Shop
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Status Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant pb-2 border-b border-surface-container">
              <span>All Logs ({orders.length})</span>
              <span className="text-primary">Synced: Just Now</span>
            </div>

            {/* Orders Feed */}
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white border border-surface-container/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left"
                >
                  {/* Card Header Section */}
                  <div className="bg-primary/5 px-6 py-5 border-b border-surface-container/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black tracking-tight text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">
                          ID: {order.id.substring(0, 12)}...
                        </span>
                        <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-on-surface-variant/40" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="text-[10px] text-on-surface-variant/70 font-semibold uppercase tracking-wider">
                        Recipient: {order.customerName} &middot; {order.customerEmail}
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-container/60">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">Grand Total</span>
                        <span className="text-sm font-black text-primary flex items-center">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black border flex items-center gap-1.5 ${
                        order.status === 'Placed'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : order.status === 'Processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : order.status === 'In Transit'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {order.status === 'Placed' && <Clock className="w-3.5 h-3.5 text-blue-500" />}
                        {order.status === 'Processing' && <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                        {order.status === 'In Transit' && <Truck className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />}
                        {order.status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items Display Column */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Item List (Left 7) */}
                    <div className="lg:col-span-7 space-y-3">
                      <h3 className="text-[10px] font-black text-on-surface uppercase tracking-wider pb-1 border-b border-surface-container/60 flex items-center gap-1.5 mb-2">
                        <Package className="w-3.5 h-3.5 text-primary" />
                        Purchased Items ({order.items.length})
                      </h3>
                      
                      <div className="space-y-2.5">
                        {order.items.map((item) => (
                          <div 
                            key={item.id}
                            className="flex items-center gap-3 p-2.5 rounded-2xl border border-surface-container/40 hover:bg-background/25 transition-all"
                          >
                            <div className="w-10 h-10 rounded-xl bg-background border border-surface-container/40 overflow-hidden flex-shrink-0 relative">
                              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs truncate text-on-surface">
                                {item.name}
                              </h4>
                              <span className="text-[9px] text-on-surface-variant/70 font-semibold block mt-0.5">
                                ₹{item.price.toFixed(2)} each
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0 text-xs font-bold text-on-surface">
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              <span className="text-[9px] text-on-surface-variant font-medium block">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address and Logistics Action (Right 5) */}
                    <div className="lg:col-span-5 bg-background/40 border border-surface-container/40 rounded-2xl p-5 flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-[10px] font-black text-on-surface uppercase tracking-wider pb-1 border-b border-surface-container/60 flex items-center gap-1.5 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          Delivery Coordinates
                        </h3>
                        <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                          {order.shippingAddress}
                        </p>
                        <span className="inline-block mt-2 text-[9px] font-bold bg-white border border-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full">
                          ZIP: {order.zipCode}
                        </span>
                      </div>

                      {/* Interactive Logistics Link */}
                      <div className="pt-4 border-t border-surface-container/60 flex flex-col gap-2">
                        <Link 
                          href={`/delivery?id=${order.id}`}
                          className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:bg-primary/95 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Track Dispatch Portal
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
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

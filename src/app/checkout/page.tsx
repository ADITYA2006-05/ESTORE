'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { Lock, ArrowLeft, Loader2, ShieldCheck, CreditCard, Calendar, Key, MapPin, Mail, User, Sparkles, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function Checkout() {
  const router = useRouter()
  const { cartItems, cartTotal, clearCart } = useCart()

  // Checkout Form States
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [zip, setZip] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  // Processing Flow States
  const [processing, setProcessing] = useState(false)

  // Auth Gate States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [guestBypass, setGuestBypass] = useState<boolean>(false)

  // Guest registration details
  const [createAccount, setCreateAccount] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const generateSecurePassword = () => {
    const adjectives = ['Minimal', 'Luxury', 'Nordic', 'Aesthetic', 'Linear', 'Cosmic', 'Sleek', 'Premium']
    const nouns = ['Linen', 'Studio', 'Decor', 'Vase', 'Apparel', 'Curator', 'Design', 'Space']
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    const num = Math.floor(100 + Math.random() * 900) // 3-digit number
    const special = ['!', '@', '#', '$'][Math.floor(Math.random() * 4)]
    const generated = `${adj}${noun}${num}${special}`
    setPassword(generated)
    setShowPassword(true)
  }

  // Prefill signed-in customer info if available
  useEffect(() => {
    const stored = localStorage.getItem('estore_customer_user')
    if (stored) {
      try {
        const user = JSON.parse(stored)
        if (user.email) setEmail(user.email)
        if (user.name) {
          setName(user.name)
          setCardName(user.name)
        }
        setIsAuthenticated(true)
      } catch (err) {
        console.error('Failed to prefill customer data:', err)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  // Show a premium secure preloader while session checks resolve
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-on-surface-variant animate-pulse">Establishing Secure Gate...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate luxury animation process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      let customerUserId = null

      // Auto-register guest if they chose to create an account
      if (!isAuthenticated && createAccount) {
        if (!password || password.trim().length < 6) {
          throw new Error('Please enter or generate a password of at least 6 characters.')
        }

        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password
          })
        })

        const regData = await regRes.json()

        if (!regRes.ok) {
          throw new Error(regData.error || 'Failed to auto-register account. This email may already be in use.')
        }

        // Store user profile session dynamically in browser
        localStorage.setItem('estore_customer_user', JSON.stringify(regData.user))
        window.dispatchEvent(new Event('storage'))
        customerUserId = regData.user.id
      } else {
        // Load current logged-in customer ID if any
        const stored = localStorage.getItem('estore_customer_user')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            customerUserId = parsed.id
          } catch (err) {
            console.error('Failed to parse customer user session:', err)
          }
        }
      }

      // Calculate totals
      const tax = cartTotal * 0.08
      const grandTotal = cartTotal + tax

      // Post to our order creation API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          shippingAddress: address,
          zipCode: zip,
          totalAmount: grandTotal,
          userId: customerUserId,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to place order')
      }

      const data = await response.json()
      
      // Empty the cart in local state
      clearCart()
      
      // Redirect to the dynamic Delivery Tracking Portal
      router.push(`/delivery?id=${data.orderId}`)
    } catch (error: any) {
      alert(error.message || 'Something went wrong while processing your payment. Please try again.')
      setProcessing(false)
    }
  }

  // Cost summaries
  const tax = cartTotal * 0.08
  const grandTotal = cartTotal + tax

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Screen Loader processing payment */}
      {processing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-fadeIn">
          <div className="relative w-20 h-20 mb-6">
            <Loader2 className="w-20 h-20 text-primary-container animate-spin absolute" />
            <CreditCard className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Processing Payment...</h2>
          <p className="text-white/70 text-xs font-medium max-w-xs text-center leading-relaxed">
            Please do not exit the browser or refresh this tab. We are establishing a highly secure transaction tunnel to authorization keys.
          </p>
        </div>
      )}

      {/* Main Content */}
      <section className="flex-1 max-w-7xl mx-auto w-full py-16 px-6 lg:px-16">
        {/* Back link */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-10 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Catalog
        </Link>

        {cartItems.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto bg-white border border-surface-container rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Your Cart is Empty</h3>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              We cannot checkout with zero products. Browse our shop to add beautiful items first.
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Payment & Shipping Inputs (Column 7) */}
            {!isAuthenticated && !guestBypass ? (
              <div className="lg:col-span-7 bg-white border border-surface-container/60 rounded-3xl p-8 md:p-10 shadow-level3 relative overflow-hidden space-y-8 flex flex-col justify-center min-h-[500px] animate-fadeIn">
                {/* Decorative Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl pointer-events-none animate-pulse" />

                <div className="text-center max-w-md mx-auto space-y-6 relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block animate-none">
                      Secure Checkout Gateway
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
                      Protect Your Purchases
                    </h2>
                    <p className="text-on-surface-variant text-xs leading-relaxed max-w-sm mx-auto">
                      Sign in or create a lifestyle profile to unlock premium live priority shipment tracking, secure order history, and save address info for future checkout speeds.
                    </p>
                  </div>

                  <div className="pt-2 space-y-4">
                    <Link
                      href="/login?redirect=/checkout"
                      className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
                    >
                      <User className="w-4 h-4" />
                      Sign In or Register Account
                    </Link>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-surface-container/60"></div>
                      <span className="flex-shrink mx-4 text-[9px] text-on-surface-variant/40 font-extrabold uppercase tracking-widest">or</span>
                      <div className="flex-grow border-t border-surface-container/60"></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGuestBypass(true)}
                      className="w-full border border-surface-container bg-white text-on-surface py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold hover:border-primary/30 transition-all cursor-pointer text-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      <span>Continue as Guest Checkout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePay} className="lg:col-span-7 space-y-10 animate-fadeIn">
                {!isAuthenticated && guestBypass && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-on-primary-container font-semibold animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span>Checking out as a Guest. You can </span>
                      <Link href="/login?redirect=/checkout" className="text-primary hover:underline font-bold">
                        sign in or create an account
                      </Link>
                      <span> anytime before submitting to unlock real-time priority tracking and save your delivery details.</span>
                    </div>
                  </div>
                )}
              
              {/* Shipping Information */}
              <div className="bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  1. Shipping Information
                </h2>

                <div className="space-y-4">
                  {/* Email address */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>
                  </div>

                  {/* Recipient Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>
                  </div>

                  {/* Delivery Address / Zip code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Minimalist Avenue"
                        className="w-full bg-background border border-surface-container rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                        ZIP / Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="10001"
                        className="w-full bg-background border border-surface-container rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Registration Section for Guests */}
              {!isAuthenticated && (
                <div className="bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight">Save Details & Create Account</h2>
                      <p className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                        Optional Account Setup
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => {
                          setCreateAccount(e.target.checked)
                          if (!e.target.checked) setPassword('')
                        }}
                        className="mt-1 rounded border-surface-container text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-on-surface group-hover:text-primary transition-colors block">
                          Save my details and create a secure store account for future purchases
                        </span>
                        <span className="text-[10px] text-on-surface-variant/70 leading-relaxed block mt-0.5">
                          Unlocks order history, live priority shipping logistics, and rapid checkouts.
                        </span>
                      </div>
                    </label>

                    {createAccount && (
                      <div className="pt-4 border-t border-surface-container/60 space-y-4 animate-fadeIn">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                            Set Account Password *
                          </label>
                          <div className="relative">
                            <Key className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required={createAccount}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Min. 6 characters"
                              className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4 animate-fadeIn" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            type="button"
                            onClick={generateSecurePassword}
                            className="flex-1 border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all cursor-pointer text-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            Auto-Generate Password
                          </button>
                          {password && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(password)
                                alert('Password copied to clipboard!')
                              }}
                              className="border border-surface-container hover:bg-background text-on-surface-variant py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all cursor-pointer text-xs"
                            >
                              Copy Password
                            </button>
                          )}
                        </div>

                        {password && showPassword && (
                          <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex flex-col gap-1">
                            <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider block">
                              Generated Password:
                            </span>
                            <code className="text-xs font-bold text-green-950 font-mono select-all bg-white border border-green-200/60 p-2 rounded-lg block text-center">
                              {password}
                            </code>
                            <span className="text-[9px] font-medium text-green-900/60 leading-relaxed block mt-0.5 text-center">
                              Please write down or copy this password to sign in later.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    2. Payment Credentials
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>SSL SECURED</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name on Card */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                      Name on Card *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Cardholder Name"
                        className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium animate-none"
                      />
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                      Card Number *
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium font-mono"
                      />
                    </div>
                  </div>

                  {/* Exp / CVV */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                        Expiration Date *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                        CVV *
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit pay */}
              <button
                type="submit"
                className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 font-extrabold shadow-md hover:shadow-lg hover:scale-[0.99] transition-all cursor-pointer text-base"
              >
                <Lock className="w-4 h-4" />
                Submit Payment of ₹{grandTotal.toFixed(2)}
              </button>
            </form>
          )}

            {/* Cart Summary Panel (Column 5) */}
            <div className="lg:col-span-5 bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm h-fit space-y-6">
              <h3 className="text-xl font-bold tracking-tight">Order Summary</h3>

              {/* Cart Items list */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 divide-y divide-surface-container">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pt-4 first:pt-0 border-0">
                    <div className="w-14 h-14 bg-background rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-bold text-xs truncate text-on-surface">{item.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                        Qty {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-xs self-center">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-3 pt-6 border-t border-surface-container/60 text-xs font-semibold text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Surcharges & Taxes (8%)</span>
                  <span className="text-on-surface">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch & Delivery</span>
                  <span className="text-on-surface">Free</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold pt-4 border-t border-surface-container text-on-surface">
                  <span>Total Amount</span>
                  <span className="text-primary text-base font-extrabold">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, Lock, User as UserIcon, Mail, Sparkles, ArrowLeft, Loader2, KeyRound, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GoogleSSOPopup from '@/components/GoogleSSOPopup'

export default function Login() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-bold text-on-surface-variant animate-pulse">Initializing Gateway...</p>
        </div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  
  // Gate Modes: 'customer' | 'admin'
  const [gateMode, setGateMode] = useState<'customer' | 'admin'>('customer')
  
  // Customer Auth Tabs: 'signin' | 'signup'
  const [customerTab, setCustomerTab] = useState<'signin' | 'signup'>('signin')

  // Credentials Forms
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Admin Credentials
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  // UI States
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [googlePopupOpen, setGooglePopupOpen] = useState(false)

  // Handle Customer Form Submissions (Login & Register)
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const endpoint = customerTab === 'signin' ? '/api/auth/login' : '/api/auth/register'
      const payload = customerTab === 'signin' 
        ? { email, password } 
        : { name, email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        if (customerTab === 'signup') {
          setSuccessMsg(`Welcome, ${name}! Your account has been registered successfully.`)
          // Automatically switch to sign-in tab
          setCustomerTab('signin')
          setPassword('')
        } else {
          // Store customer profile session in localStorage
          localStorage.setItem('estore_customer_user', JSON.stringify(data.user))
          router.push(redirect || '/shop')
          // Trigger header sync
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify credentials.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Google Login Callback Selection
  const handleGoogleSelect = async (profile: { name: string; email: string }) => {
    setGooglePopupOpen(false)
    setErrorMsg('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, name: profile.name })
      })

      const data = await res.json()

      if (res.ok) {
        // Store Google session token payload
        localStorage.setItem('estore_customer_user', JSON.stringify(data.user))
        router.push(redirect || '/shop')
        // Trigger header sync
        window.dispatchEvent(new Event('storage'))
      } else {
        setErrorMsg(data.error || 'Failed to authenticate Google credentials.')
      }
    } catch (err) {
      setErrorMsg('Failed to process Google SSO profile.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Admin Authorization
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    // Simulate key matching lag
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('estore_admin_logged_in', 'true')
        router.push('/admin')
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify admin credentials.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <Navbar />

      {/* Decorative Glow Filters */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <section className="flex-1 flex items-center justify-center py-20 px-6 relative z-10">
        <div className="w-full max-w-md bg-white border border-surface-container/60 rounded-3xl p-8 md:p-10 shadow-level3 backdrop-blur-md">
          {/* Back to Home Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-8 uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Store
          </Link>

          {/* Header Banner */}
          <div className="mb-8">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
              {gateMode === 'customer' ? 'Customer Gateway' : 'Database Administrator'}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
              {gateMode === 'customer' 
                ? (customerTab === 'signin' ? 'Welcome Back' : 'Join the Space') 
                : 'Admin Keyway'}
            </h1>
            <p className="text-on-surface-variant text-xs leading-relaxed mt-1">
              {gateMode === 'customer'
                ? (customerTab === 'signin' 
                  ? 'Sign in to access your order history and checkout faster.' 
                  : 'Register a lifestyle profile to complete secure cart purchases.')
                : 'Enter database credentials to manage products and inventory.'}
            </p>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-start gap-2.5">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {gateMode === 'customer' ? (
            /* =====================================
               CUSTOMER AUTHENTICATION MODE
               ===================================== */
            <div className="space-y-6">
              {/* Tab Toggles */}
              <div className="flex bg-background border border-surface-container rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('signin')
                    setErrorMsg('')
                    setSuccessMsg('')
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    customerTab === 'signin' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-on-surface-variant/70 hover:text-primary'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('signup')
                    setErrorMsg('')
                    setSuccessMsg('')
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    customerTab === 'signup' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-on-surface-variant/70 hover:text-primary'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Customer Credentials Form */}
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                {customerTab === 'signup' && (
                  /* Name field (Sign up only) */
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sophia Chen"
                        className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium text-on-surface placeholder:text-on-surface-variant/35"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sophia@design.com"
                      className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium text-on-surface placeholder:text-on-surface-variant/35"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium text-on-surface placeholder:text-on-surface-variant/35"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin animate-infinite" />
                      Processing Credentials...
                    </>
                  ) : (
                    customerTab === 'signin' ? 'Sign In Account' : 'Register Profile'
                  )}
                </button>
              </form>

              {/* OR divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-surface-container/60"></div>
                <span className="flex-shrink mx-4 text-[10px] text-on-surface-variant/40 font-extrabold uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-surface-container/60"></div>
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={() => setGooglePopupOpen(true)}
                disabled={loading}
                className="w-full border border-surface-container bg-white text-on-surface py-3.5 rounded-xl flex items-center justify-center gap-3 font-bold hover:border-primary/30 transition-all cursor-pointer text-xs"
              >
                {/* Simulated Google Logo Colors */}
                <div className="flex gap-0.5 font-sans tracking-tight text-xs">
                  <span className="text-blue-500 font-extrabold">G</span>
                  <span className="text-red-500 font-extrabold">o</span>
                  <span className="text-yellow-500 font-extrabold">o</span>
                  <span className="text-blue-500 font-extrabold">g</span>
                  <span className="text-green-500 font-extrabold">l</span>
                  <span className="text-red-500 font-extrabold">e</span>
                </div>
                <span>Continue with Google Account</span>
              </button>

              {/* Admin Gateway Switcher */}
              <div className="mt-8 pt-6 border-t border-surface-container/60 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setGateMode('admin')
                    setErrorMsg('')
                    setSuccessMsg('')
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-all font-bold uppercase tracking-wider cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Administrator Gateway
                </button>
              </div>
            </div>
          ) : (
            /* =====================================
               ADMINISTRATOR AUTHENTICATION MODE
               ===================================== */
            <div className="space-y-6">
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                {/* Admin Username */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Admin Username
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium text-on-surface placeholder:text-on-surface-variant/35"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-background border border-surface-container rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium text-on-surface placeholder:text-on-surface-variant/35"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin animate-infinite" />
                      Unlocking Vault...
                    </>
                  ) : (
                    'Authenticate Administrator'
                  )}
                </button>
              </form>

              {/* Secured administrative access gate. Pre-configured dev demo credentials have been securely disabled. */}

              {/* Customer Gateway switcher */}
              <div className="mt-8 pt-6 border-t border-surface-container/60 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setGateMode('customer')
                    setErrorMsg('')
                    setSuccessMsg('')
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-all font-bold uppercase tracking-wider cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Customer Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Simulated Interactive Google Popup Dialog */}
      <GoogleSSOPopup 
        isOpen={googlePopupOpen}
        onClose={() => setGooglePopupOpen(false)}
        onSelect={handleGoogleSelect}
      />

      <Footer />
    </main>
  )
}

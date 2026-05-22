'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'

interface CustomerUser {
  name: string
  email: string
  provider: string
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { toggleCart, cartCount } = useCart()

  // Sync scroll state and scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - move header up and hide
        setIsVisible(false)
      } else {
        // Scrolling up - reveal header
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Sync and load Customer Profile
  useEffect(() => {
    const loadSession = () => {
      const stored = localStorage.getItem('estore_customer_user')
      if (stored) {
        try {
          setCustomerUser(JSON.parse(stored))
        } catch (e) {
          setCustomerUser(null)
        }
      } else {
        setCustomerUser(null)
      }
    }

    loadSession()

    // Listen to custom local storage syncs
    window.addEventListener('storage', loadSession)
    return () => window.removeEventListener('storage', loadSession)
  }, [])

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('estore_customer_user')
    setCustomerUser(null)
    setDropdownOpen(false)
    window.dispatchEvent(new Event('storage')) // Notify other elements
    window.location.href = '/' // Force client redirect
  }

  // Get Initials for profile avatar
  const getInitials = (fullName: string) => {
    if (!fullName) return 'U'
    const parts = fullName.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].substring(0, 2).toUpperCase()
  }

  return (
    <header className={`sticky top-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary">
          ESTORE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-sm font-semibold hover:text-primary transition-colors">Shop</Link>
          <Link href="/categories" className="text-sm font-semibold hover:text-primary transition-colors">Categories</Link>
          <Link href="/new" className="text-sm font-semibold hover:text-primary transition-colors">New Arrivals</Link>
          <Link href="/about" className="text-sm font-semibold hover:text-primary transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-5">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors cursor-pointer">
            <Search className="w-5 h-5" />
          </button>

          {/* User Profile Gate Option */}
          {customerUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-container rounded-full transition-colors cursor-pointer"
              >
                {/* Initials Circle */}
                <div className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm">
                  {getInitials(customerUser.name)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant/75" />
              </button>

              {/* Glassmorphic Profile Menu Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-md border border-surface-container/80 rounded-2xl p-4 shadow-level3 min-w-56 z-50 text-left animate-fadeIn">
                  <div className="pb-3 border-b border-surface-container/60 mb-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-0.5">
                      Logged In User
                    </span>
                    <span className="font-extrabold text-xs text-on-surface block truncate">
                      {customerUser.name}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/70 block truncate">
                      {customerUser.email}
                    </span>
                  </div>

                  <Link
                    href="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container rounded-xl transition-colors cursor-pointer mb-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                    My Order History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="p-2 hover:bg-surface-container rounded-full transition-colors cursor-pointer block">
              <User className="w-5 h-5" />
            </Link>
          )}

          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-surface-container rounded-full relative transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 hover:bg-surface-container rounded-full transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

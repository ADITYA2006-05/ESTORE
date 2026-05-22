'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Search, ShoppingBag, Truck, User, ArrowRight, MessageSquare, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react'

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    {
      icon: ShoppingBag,
      title: 'Orders & Payments',
      description: 'Track orders, modify shipping info, or manage checkout payments.',
      links: [
        { label: 'Track live dispatch', href: '/orders' },
        { label: 'Secure billing info', href: '/faq?cat=payments' },
        { label: 'Cancel or edit order', href: '/contact?topic=orders' }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Returns',
      description: 'Review our dispatch times, shipping rates, and refund pipelines.',
      links: [
        { label: 'Shipping rates & times', href: '/shipping#rates' },
        { label: '30-day return policy', href: '/shipping#returns' },
        { label: 'Request a refund', href: '/contact?topic=returns' }
      ]
    },
    {
      icon: User,
      title: 'Account & Security',
      description: 'Manage your client profile, passwords, or Google auth login.',
      links: [
        { label: 'Register new account', href: '/login' },
        { label: 'Password recovery', href: '/login' },
        { label: 'Google integration help', href: '/faq?cat=account' }
      ]
    }
  ]

  const featuredArticles = [
    { title: 'How secure is the checkout payment process?', href: '/faq#pay-safety', readingTime: '2 min read' },
    { title: 'What is our 30-day premium return policy?', href: '/shipping#returns', readingTime: '3 min read' },
    { title: 'How do I log into the administrative monitor dashboard?', href: '/faq#admin', readingTime: '1 min read' }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Header Area */}
      <section className="bg-slate-900 text-white py-20 px-6 lg:px-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 inline-block">
            Support Portal
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            How can we assist you today?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Search our curated guide repository or connect directly with our automated AI assistant in the bottom right corner.
          </p>

          {/* Search Mockup */}
          <div className="max-w-lg mx-auto relative mt-8">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search help articles (e.g. returns, checkout, admin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white placeholder:text-slate-500 font-medium shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Category Grids */}
      <section className="flex-1 max-w-7xl mx-auto w-full py-16 px-6 lg:px-16 space-y-16">
        
        {/* Core Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <div 
                key={idx}
                className="bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-on-surface">{cat.title}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-container/60 space-y-3">
                  {cat.links.map((link, lIdx) => (
                    <Link 
                      key={lIdx} 
                      href={link.href}
                      className="group flex justify-between items-center text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Featured Guides & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          
          {/* Quick Guides list (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Featured Help Guides
            </h2>
            
            <div className="bg-white border border-surface-container/60 rounded-3xl divide-y divide-surface-container overflow-hidden shadow-sm">
              {featuredArticles.map((article, idx) => (
                <Link 
                  key={idx} 
                  href={article.href}
                  className="p-5 flex justify-between items-center hover:bg-slate-50/50 transition-colors group block"
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <span className="text-[10px] text-on-surface-variant/70 font-semibold uppercase tracking-wider block">
                      {article.readingTime}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Overlay Card (Col 5) */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-md flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
            
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-container" />
              </div>
              <span className="text-[9px] font-extrabold text-primary-container uppercase tracking-widest block">
                Instant Assistance
              </span>
              <h3 className="text-xl font-extrabold tracking-tight">Still need custom support?</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Connect directly with our 24/7 automated **AI Concierge** (floating sparkles icon in the bottom right corner) or submit a secure support request to our help desk.
              </p>
            </div>

            <div className="pt-8 relative z-10 flex gap-3">
              <Link 
                href="/contact"
                className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-extrabold text-xs text-center hover:bg-slate-100 transition-colors"
              >
                Inquire Help Desk
              </Link>
              <button 
                type="button"
                onClick={() => {
                  // Trigger click on AIAssistant floating sparkles button
                  const button = document.querySelector('button[class*="rounded-full"][class*="shadow-level2"]') as HTMLButtonElement
                  if (button) button.click()
                }}
                className="flex-1 border border-white/20 hover:bg-white/10 text-white py-3 rounded-xl font-extrabold text-xs text-center transition-colors"
              >
                Launch Store AI
              </button>
            </div>
          </div>

        </div>

      </section>

      <Footer />
    </main>
  )
}

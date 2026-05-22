'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Inbox
} from 'lucide-react'

export default function ShippingReturns() {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns'>('shipping')

  const shippingSteps = [
    {
      title: 'Order Placed & Verified',
      description: 'Your premium selection is secured, payment is validated via Razorpay, and details are logged in our SQLite registry.',
      icon: Inbox,
      time: 'Within 2 hours'
    },
    {
      title: 'Artisanal Packaging',
      description: 'Items are meticulously inspected, authenticated, and packed in eco-friendly signature luxury wrapping.',
      icon: Package,
      time: 'Same or next day'
    },
    {
      title: 'Courier Dispatch',
      description: 'Handed over to our premium logistics partners (DHL Express / FedEx Priority) with fully encrypted live tracking.',
      icon: Truck,
      time: 'Day 1 - Day 2'
    },
    {
      title: 'Exquisite Delivery',
      description: 'Delivered directly to your doorstep with signature verification and dynamic tracking updates.',
      icon: CheckCircle2,
      time: 'Day 3 - Day 5'
    }
  ]

  const refundSteps = [
    {
      title: 'Initiate Return Request',
      description: 'Navigate to your customer dashboard, select the order, and submit a secure ticket detailing your request.',
      icon: AlertCircle
    },
    {
      title: 'Complimentary Pick-up',
      description: 'A pre-paid shipping label is generated instantly, and a premium courier is dispatched to collect the package.',
      icon: Truck
    },
    {
      title: 'Inspection & Authentication',
      description: 'Our quality assurance team reviews the returned items to verify original luxury condition and tags.',
      icon: ShieldCheck
    },
    {
      title: 'Instant Refund Processing',
      description: 'Refund is processed immediately back to your original payment method (via Razorpay dashboard API).',
      icon: RotateCcw
    }
  ]

  const shippingRates = [
    { tier: 'Standard Delivery', cost: 'Complimentary', time: '3 - 5 business days', threshold: 'On all standard customer orders' },
    { tier: 'Express Courier Dispatch', cost: '₹299', time: '1 - 2 business days', threshold: 'Available at checkout for express delivery' },
    { tier: 'VIP Midnight Concierge Delivery', cost: '₹999', time: 'Guaranteed same-day/midnight', threshold: 'Selected metropolitan regions only' }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Page Hero Header */}
      <section className="bg-slate-900 text-white py-20 px-6 lg:px-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 inline-block">
            Store Logistics
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Shipping & Returns
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Transparent shipping timelines, luxury grade logistics handling, and seamless 30-day return policy.
          </p>

          {/* Premium Tab Selector */}
          <div className="flex justify-center pt-6">
            <div className="bg-slate-800/80 border border-slate-700/50 p-1.5 rounded-2xl flex gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'shipping' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4" />
                Shipping Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('returns')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'returns' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Returns & Refunds
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dynamic Content Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full py-16 px-6 lg:px-16">
        
        {activeTab === 'shipping' ? (
          <div className="space-y-16 animate-fade-in">
            {/* Shipping Timeline Grid */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-extrabold text-on-surface">The Dispatch Timeline</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Follow the premium journey of your order from payment confirmation to delivery.
                </p>
              </div>

              {/* Progress Stepper Visual */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative pt-4">
                {shippingSteps.map((step, idx) => {
                  const Icon = step.icon
                  return (
                    <div key={idx} className="relative bg-white border border-surface-container/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                            Step 0{idx + 1}
                          </span>
                          <h3 className="text-sm font-extrabold text-on-surface">{step.title}</h3>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-primary-container" />
                        <span>{step.time}</span>
                      </div>

                      {/* Connecting Line for Desktops */}
                      {idx < 3 && (
                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-6 w-4 h-0.5 border-t border-dashed border-slate-300 z-10" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Shipping Rates Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-block">
                  Rates & Options
                </span>
                <h2 className="text-3xl font-extrabold text-on-surface leading-tight">
                  Premium Delivery Rates
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We believe luxury customer support includes transparent logistics. All shipments are signature-tracked and fully insured for complete peace of mind.
                </p>
                <div className="bg-slate-50 border border-surface-container/40 p-5 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">100% Insured Delivery</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Should a package be lost or damaged in transit, we guarantee immediate replacement or a complete refund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm overflow-hidden">
                <div className="space-y-6">
                  {shippingRates.map((rate, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-surface-container/30">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-on-surface">{rate.tier}</h4>
                          {idx === 0 && (
                            <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant/80 font-medium">
                          {rate.threshold} &bull; <span className="text-primary font-bold">{rate.time}</span>
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0 text-right">
                        <span className="text-lg font-black text-on-surface">{rate.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-16 animate-fade-in">
            {/* Returns Timeline Grid */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-extrabold text-on-surface">Simplified Returns Pipeline</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We stand by the exceptional quality of our curation. If you are not entirely satisfied, returning items is straightforward.
                </p>
              </div>

              {/* Progress Stepper Visual */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative pt-4">
                {refundSteps.map((step, idx) => {
                  const Icon = step.icon
                  return (
                    <div key={idx} className="relative bg-white border border-surface-container/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                            Step 0{idx + 1}
                          </span>
                          <h3 className="text-sm font-extrabold text-on-surface">{step.title}</h3>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Connecting Line for Desktops */}
                      {idx < 3 && (
                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-6 w-4 h-0.5 border-t border-dashed border-slate-300 z-10" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Core Return Policy Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3.5 py-1.5 rounded-full inline-block">
                  Terms & Integrity
                </span>
                <h2 className="text-3xl font-extrabold text-on-surface leading-tight">
                  30-Day Premium Return Policy
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We accept returns of unused, undamaged items with original tags and luxury packing intact within **30 days** of delivery receipt.
                </p>
                <div className="space-y-4 pt-2">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-extrabold text-slate-600">✓</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong>Refunds</strong> are refunded directly to the original bank account or card processed via Razorpay within 5-7 business days.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-extrabold text-slate-600">✓</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong>Exchanges</strong> for different sizes, colors, or alternative inventory are processed instantly upon inspection validation.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-extrabold text-slate-600">✓</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong>Exceptions</strong>: Bespoke custom orders, beauty/hygiene products with broken security seals, and final sale items are ineligible for refund returns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-md flex flex-col justify-between min-h-[300px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-primary-container" />
                  </div>
                  <span className="text-[9px] font-extrabold text-primary-container uppercase tracking-widest block">
                    Instant Return
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight">Need to request a return?</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Submit your ticket now. Or, click the button below to launch our interactive support chat dashboard and receive live step-by-step return labels.
                  </p>
                </div>

                <div className="pt-8 relative z-10 flex gap-3">
                  <Link 
                    href="/contact?topic=returns"
                    className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-extrabold text-xs text-center hover:bg-slate-100 transition-colors"
                  >
                    Contact Help Desk
                  </Link>
                  <button 
                    type="button"
                    onClick={() => {
                      const button = document.querySelector('button[class*="rounded-full"][class*="shadow-level2"]') as HTMLButtonElement
                      if (button) button.click()
                    }}
                    className="flex-1 border border-white/20 hover:bg-white/10 text-white py-3 rounded-xl font-extrabold text-xs text-center transition-colors"
                  >
                    Return Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick FAQ Cross-link */}
        <div className="mt-20 border-t border-surface-container/60 pt-10 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-primary mx-auto" />
          <h3 className="text-lg font-extrabold text-on-surface">Have more logistics questions?</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Find immediate insights on shipping, international duty rates, order delays, and product authentication in our interactive Frequently Asked Questions.
          </p>
          <div className="pt-2">
            <Link 
              href="/faq" 
              className="inline-flex items-center gap-2 text-xs font-black text-primary hover:text-primary-container transition-colors group"
            >
              <span>Explore Interactive FAQs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  )
}

'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden px-6 bg-gradient-to-b from-[#f5ebd7]/30 to-transparent">
      {/* Organic fluid ambient glowing blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-secondary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#c86348]/8 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f7e8e4] border border-[#c86348]/20 text-[#7d3421] rounded-full shadow-sm animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase">
              Handcrafted Collection 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-normal tracking-tight leading-[1.05] text-on-surface">
            Bespoke <span className="italic font-serif text-secondary block sm:inline">Minimalism</span> for Daily Life.
          </h1>

          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-medium">
            Discover a thoughtfully curated range of organic apparel, handcrafted homeware, and sleek tech essentials constructed by skilled artisans for dynamic functional harmony.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto btn-primary px-8 py-4 text-base font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 group transition-all"
            >
              Shop Curated Catalog
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1.5 text-white" />
            </Link>
            <Link 
              href="/categories" 
              className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-on-surface hover:text-secondary bg-white hover:bg-neutral-50 rounded-2xl border border-surface-container shadow-sm hover:shadow transition-all block text-center"
            >
              Explore Departments
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

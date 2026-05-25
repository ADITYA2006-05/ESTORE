'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

interface ProductProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  stock: number
}

export default function ProductCard({ id, name, price, image, category, stock }: ProductProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id, name, price, image, category, stock })
  }

  return (
    <Link href={`/shop/${id}`} className="block h-full cursor-pointer">
      <motion.div 
        whileHover={stock > 0 ? { y: -8 } : {}}
        className="product-card group relative overflow-hidden bg-white p-4 h-full flex flex-col justify-between"
      >
        {/* Padded, centered, and scaled-down product image frame */}
        <div className="aspect-[4/3] relative overflow-hidden bg-[#faf8f5] border border-secondary/10 rounded-2xl flex items-center justify-center p-4 transition-all duration-300 group-hover:bg-[#f4f1ea] z-10 flex-shrink-0">
          <img 
            src={image} 
            alt={name}
            className={`object-contain w-full h-full max-h-[140px] transition-all duration-500 ease-out ${
              stock > 0 
                ? 'group-hover:scale-105' 
                : 'grayscale contrast-75 opacity-60'
            }`}
          />
          
          {/* Badges Stack */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className="bg-white/95 backdrop-blur-sm text-[8px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider text-on-surface shadow-sm border border-secondary/5">
              {category}
            </span>
            {stock === 0 ? (
              <span className="bg-red-500 text-white text-[8px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                Sold Out
              </span>
            ) : stock <= 5 ? (
              <span className="bg-[#c86348] text-white text-[8px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                Only {stock} Left!
              </span>
            ) : (
              <span className="bg-primary text-white text-[8px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                In Stock
              </span>
            )}
          </div>

          {/* Center Sold Out Overlay */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center pointer-events-none rounded-2xl">
              <span className="bg-white/95 text-red-600 font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-widest shadow-md">
                Sold Out
              </span>
            </div>
          )}

          {/* Add to Cart button */}
          {stock > 0 && (
            <button 
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 p-2.5 bg-primary text-white rounded-xl shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-115 cursor-pointer z-20"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="pt-5 px-2 pb-2 flex-grow flex flex-col justify-between">
          <h3 className={`text-base font-extrabold mb-1.5 transition-colors line-clamp-2 ${stock > 0 ? 'group-hover:text-secondary' : 'text-on-surface-variant/70 line-through'}`}>{name}</h3>
          <p className="text-secondary font-extrabold text-sm">₹{price.toFixed(2)}</p>
        </div>
      </motion.div>
    </Link>
  )
}

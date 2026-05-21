'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'

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
    <motion.div 
      whileHover={stock > 0 ? { y: -8 } : {}}
      className="product-card group relative overflow-hidden bg-white border border-surface-container rounded-3xl transition-all shadow-sm"
    >
      <div className="aspect-square relative overflow-hidden bg-background">
        <img 
          src={image} 
          alt={name}
          className={`object-cover w-full h-full transition-transform duration-500 ${
            stock > 0 
              ? 'group-hover:scale-110' 
              : 'grayscale contrast-75 opacity-60'
          }`}
        />
        
        {/* Badges Stack */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          <span className="bg-white/95 backdrop-blur-sm text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider text-on-surface shadow-sm">
            {category}
          </span>
          {stock === 0 ? (
            <span className="bg-red-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          ) : stock <= 5 ? (
            <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Only {stock} Left!
            </span>
          ) : (
            <span className="bg-green-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Center Sold Out Overlay */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-red-600 font-black text-xs px-4 py-2 rounded-xl uppercase tracking-widest shadow-md">
              Sold Out
            </span>
          </div>
        )}

        {/* Add to Cart button */}
        {stock > 0 && (
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 cursor-pointer z-20"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="p-6">
        <h3 className={`text-lg font-bold mb-1 transition-colors ${stock > 0 ? 'group-hover:text-primary' : 'text-on-surface-variant/70 line-through'}`}>{name}</h3>
        <p className="text-on-surface-variant font-medium">₹{price.toFixed(2)}</p>
      </div>
    </motion.div>
  )
}

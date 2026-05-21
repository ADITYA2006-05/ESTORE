'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const { cartItems, isOpen, setIsOpen, updateQuantity, removeFromCart, cartTotal } = useCart()
  const router = useRouter()

  const handleCheckoutClick = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-surface-container"
          >
            {/* Header */}
            <div className="h-20 px-6 border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Shopping Cart</h2>
                {cartItems.length > 0 && (
                  <span className="bg-primary/10 text-primary text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-background rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-on-surface-variant/40" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Your cart is empty</h3>
                  <p className="text-on-surface-variant text-sm max-w-[240px] mb-8">
                    Add items to your cart to see them here and proceed to checkout.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/shop')
                    }}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-surface-container/60 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-background rounded-xl overflow-hidden relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm leading-tight text-on-surface hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:text-red-500 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">{item.category}</p>
                        {item.stock <= 5 && (
                          <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-wider animate-pulse">
                            Only {item.stock} left in stock
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-surface-container rounded-lg bg-background overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-surface-container transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`p-1.5 hover:bg-surface-container transition-colors ${
                              item.quantity >= item.stock ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title={item.quantity >= item.stock ? "Maximum stock reached" : "Increase quantity"}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-surface-container p-6 bg-background/50 backdrop-blur-sm">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                    <span>Subtotal</span>
                    <span className="text-on-surface font-semibold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                    <span>Shipping</span>
                    <span className="text-on-surface font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-surface-container">
                    <span>Total</span>
                    <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group hover:shadow-lg transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-xs font-bold text-on-surface-variant hover:text-primary mt-4 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

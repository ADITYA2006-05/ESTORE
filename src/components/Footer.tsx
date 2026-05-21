import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-container py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary mb-6 block">
            ESTORE
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
            Curating the finest minimalist essentials for the modern design-conscious consumer.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Shop</h4>
          <ul className="space-y-4">
            <li><Link href="/new" className="text-on-surface-variant hover:text-primary text-sm transition-colors">New Arrivals</Link></li>
            <li><Link href="/best-sellers" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Best Sellers</Link></li>
            <li><Link href="/collections" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Collections</Link></li>
            <li><Link href="/sale" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
          <ul className="space-y-4">
            <li><Link href="/help" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Help Center</Link></li>
            <li><Link href="/shipping" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/contact" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="text-on-surface-variant hover:text-primary text-sm transition-colors">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Newsletter</h4>
          <p className="text-on-surface-variant text-sm mb-6">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-background border border-surface-container px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant text-xs">© 2026 ESTORE. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

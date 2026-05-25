import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Compass, 
  Leaf, 
  Shirt, 
  Home as HomeIcon, 
  Soup, 
  Footprints, 
  Cpu 
} from 'lucide-react'

export default function Home() {
  const categories = [
    {
      name: 'Apparel',
      description: 'Breathable, sustainable linen & organic cotton clothing.',
      link: '/shop?category=Apparel',
      icon: Shirt,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
      name: 'Accessories',
      description: 'Elegant chronographs, leather backpacks & UV sunglasses.',
      link: '/shop?category=Accessories',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      name: 'Home',
      description: 'Premium handcrafted ceramics & linen bedding.',
      link: '/shop?category=Home',
      icon: HomeIcon,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      name: 'Food',
      description: 'Artisan green tea collections & organic cold-pressed oils.',
      link: '/shop?category=Food',
      icon: Soup,
      color: 'bg-teal-50 text-teal-600 border-teal-100'
    },
    {
      name: 'Daily Wear',
      description: 'Ultra-soft socks, casual loungewear & premium sneakers.',
      link: '/shop?category=Daily Wear',
      icon: Footprints,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      name: 'Electronics',
      description: 'Sleek wireless chargers, smart ambient lights & desk accessories.',
      link: '/shop?category=Electronics',
      icon: Cpu,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    }
  ]

  const values = [
    {
      icon: <Leaf className="w-6 h-6 text-primary" />,
      title: 'Sustainability First',
      description: 'Our materials are sourced from responsibly managed forests and organic suppliers.'
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Built to Last',
      description: 'We prioritize sturdy construction and time-tested techniques to guarantee lifespan.'
    },
    {
      icon: <Compass className="w-6 h-6 text-primary" />,
      title: 'Curated Elegance',
      description: 'Every design is heavily scrutinized to bring only pure, aesthetic value to your daily life.'
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Hero />
      
      {/* Editorial Category Showcase */}
      <section className="py-28 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="mb-16 text-center max-w-xl mx-auto">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-3 block">
            Curated Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-on-surface-variant text-base">
            Intentionally crafted essentials designed to complement an organized and mindful lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link 
                key={category.name} 
                href={category.link}
                className="group relative overflow-hidden rounded-3xl border border-surface-container bg-white p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                {/* Decorative background glow on card hover */}
                <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon badge */}
                <div className={`p-4 rounded-2xl border w-fit transition-all duration-300 ${category.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <div className="mt-6 space-y-2">
                  <h3 className="text-2xl font-extrabold text-on-surface tracking-tight flex items-center gap-2 group-hover:text-primary transition-colors">
                    {category.name}
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed font-medium">
                    {category.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Brand Value Section */}
      <section className="bg-white border-y border-surface-container py-24 px-6 lg:px-16 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {values.map((val) => (
              <div key={val.title} className="flex flex-col items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {val.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 tracking-tight">{val.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="py-28 px-6 lg:px-16 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1 w-full">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80" 
              alt="Interior Philosophy" 
              className="rounded-3xl shadow-level3 w-full object-cover aspect-[4/3]"
            />
          </div>
          <div className="flex-1">
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">
              Our Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tight">
              Designed for the modern individual.
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed mb-10">
              We believe that the products you surround yourself with should be as intentional as the life you lead. Our pieces are crafted with longevity, sustainability, and aesthetic harmony in mind.
            </p>
            <Link href="/about" className="btn-primary inline-flex items-center gap-2 group shadow-sm hover:shadow-md transition-all">
              Learn Our Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Banner / Call to Action */}
      <section className="bg-primary/5 border-t border-surface-container py-24 px-6 lg:px-16 text-center w-full">
        <div className="max-w-3xl mx-auto">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Ready to redesign your lifestyle?
          </h2>
          <p className="text-on-surface-variant text-base mb-10 max-w-xl mx-auto">
            Browse our full catalog of premium minimalist essentials. Free shipping worldwide on all orders.
          </p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 group px-8 py-4 text-base font-bold shadow-md hover:shadow-lg transition-all">
            Explore All Products
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

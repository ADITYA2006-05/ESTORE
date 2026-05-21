import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Compass, Leaf } from 'lucide-react'

export default function Home() {
  const categories = [
    {
      name: 'Apparel',
      description: 'Breathable, sustainable linen & organic cotton clothing.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      link: '/shop?category=Apparel',
      cols: 'col-span-1 md:col-span-2'
    },
    {
      name: 'Accessories',
      description: 'Elegant chronographs, leather backpacks & UV sunglasses.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      link: '/shop?category=Accessories',
      cols: 'col-span-1'
    },
    {
      name: 'Home',
      description: 'Premium handcrafted ceramics & linen bedding.',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      link: '/shop?category=Home',
      cols: 'col-span-1 md:col-span-3'
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.name} 
              href={category.link}
              className={`group relative overflow-hidden rounded-3xl aspect-[4/3] md:aspect-auto ${category.cols} min-h-[320px] shadow-level2 hover:shadow-level3 transition-all duration-500 block`}
            >
              {/* Image backdrop */}
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all duration-500 z-10" />
              <img 
                src={category.image} 
                alt={category.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2 block">
                  Category Showcase
                </span>
                <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
                  {category.name}
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </h3>
                <p className="text-white/95 text-sm max-w-md leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
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

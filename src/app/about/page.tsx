import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Check, Heart, HelpCircle, Star } from 'lucide-react'

export default function About() {
  const pillars = [
    {
      title: 'Intentional Living',
      text: 'We believe that the items you choose to bring into your space are a reflection of your state of mind. We construct objects that foster clarity, productivity, and calm.'
    },
    {
      title: 'Ethical Craftsmanship',
      text: 'Our sourcing agents partner exclusively with family-owned ateliers and certified sustainable workshops globally that respect human resources and material lifespans.'
    },
    {
      title: 'Zero Waste Goals',
      text: 'Our carbon-offset program ensures that every shipment is 100% neutralized, utilizing biodegradable packing shells and recycled paper sleeves exclusively.'
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-28 px-6 lg:px-16 text-center max-w-4xl mx-auto">
        <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-3 block">
          Our Brand Story
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1] text-on-surface">
          Creating Space for what <span className="text-primary">Truly Matters</span>.
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-3xl mx-auto">
          Founded in 2026, ESTORE was born out of a desire to reject excessive consumerism. We focus on curating the finest, premium essentials for the design-conscious consumer who values quality, function, and simple aesthetics over bulk quantity.
        </p>
      </section>

      {/* Dual Column Image & Text */}
      <section className="bg-white py-24 border-y border-surface-container px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-6">
            <span className="text-xs font-extrabold tracking-wider uppercase text-primary">AESTHETIC STANDARDS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Honest materials, designed for absolute structural longevity.
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed">
              We design with the modern nomad in mind. Every item—from our linen garments to our titanium chronographs—undergoes rigorous quality testing to withstand the demands of daily use without losing its structural integrity or visual charm.
            </p>
            <p className="text-on-surface-variant text-base leading-relaxed">
              By working in small production batches, we eliminate standard retail overhead and manufacturing surplus. This keeps our carbon footprint low and allows us to focus on hand-inspecting every single unit before it is prepared for dispatch.
            </p>
          </div>
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80"
              alt="Handmade Ceramic Atelier"
              className="rounded-2xl shadow-sm aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
              alt="Tailoring Fabric Work"
              className="rounded-2xl shadow-sm aspect-square object-cover mt-8"
            />
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-md mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Our Core Principles</h2>
          <p className="text-on-surface-variant text-sm">
            We are dedicated to building a brand that treats our shared ecosystem, creators, and customers with total respect and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {pillars.map((pil, idx) => (
            <div key={pil.title} className="flex flex-col gap-4 bg-white p-8 rounded-3xl border border-surface-container/60 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                {idx + 1}
              </span>
              <h3 className="font-extrabold text-lg tracking-tight mt-2">{pil.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{pil.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curation Guarantee */}
      <section className="bg-primary/5 py-24 px-6 lg:px-16 w-full text-center">
        <div className="max-w-3xl mx-auto">
          <Heart className="w-8 h-8 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            The Curation Guarantee
          </h2>
          <p className="text-on-surface-variant text-base max-w-xl mx-auto mb-8 leading-relaxed">
            If you are not completely content with the form, function, or tactile response of any ESTORE item, we offer free shipping on returns within 30 days—no questions asked.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

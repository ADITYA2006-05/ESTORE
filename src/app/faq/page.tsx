'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  User, 
  Sparkles, 
  ArrowRight,
  MessageSquare
} from 'lucide-react'

// Master FAQ Data Schema
const faqData = [
  {
    id: 'pay-options',
    category: 'payments',
    question: 'How do I pay for my luxury items?',
    answer: 'We offer secure, frictionless payments directly. We support all major Credit/Debit cards (Visa, Mastercard, RuPay, Amex). No extra processing fees are levied.'
  },
  {
    id: 'pay-safety',
    category: 'payments',
    question: 'Are my payment transactions secure?',
    answer: 'Absolutely. All payments are securely routed and authorized through our PCI-DSS compliant merchant vault. We do not store or process card numbers directly in our database. All client connection flows are encrypted with secure SSL protocols.'
  },
  {
    id: 'pay-failure',
    category: 'payments',
    question: 'What should I do if my payment fails but the money is debited?',
    answer: 'This represents a temporary bank network reconciliation delay. If an order is not successfully created, the bank will automatically reverse the charge back to your original source within 24 to 48 hours. You can also contact support@estore.vip to verify.'
  },
  {
    id: 'ship-cost',
    category: 'shipping',
    question: 'How much does luxury shipping cost?',
    answer: 'Standard shipping with signature tracking is completely complimentary on all domestic customer orders. Express Courier Dispatch is available at check-out for a flat ₹299, while VIP Midnight Concierge Delivery starts at ₹999.'
  },
  {
    id: 'ship-intl',
    category: 'shipping',
    question: 'Do you offer international shipping services?',
    answer: 'Yes, we offer worldwide courier delivery in partnership with DHL Express and FedEx Priority. Shipping rates, custom clearance duties, and taxes will be dynamically calculated during the final checkout step based on your shipping address.'
  },
  {
    id: 'ship-track',
    category: 'shipping',
    question: 'How can I track the live status of my shipment?',
    answer: 'Once dispatched, you will receive a confirmation email with a link. You can also view live delivery details under your account profile dashboard at `/orders`, or simply ask our floating Store AI concierge for instantaneous tracking logs.'
  },
  {
    id: 'return-policy',
    category: 'returns',
    question: 'What is your product return policy?',
    answer: 'We stand by the exceptional quality of our curation. We offer a complimentary 30-day return policy. Items must be in their original luxury packaging, unused, and with all designer tags and authentication seals completely intact.'
  },
  {
    id: 'return-time',
    category: 'returns',
    question: 'How long does a refund take to process?',
    answer: 'Once our authentication team receives and approves the returned items, your refund is instantly submitted to our merchant gateway. Depending on your financial institution, the credits will appear in your original payment source within 5 to 7 business days.'
  },
  {
    id: 'return-exchange',
    category: 'returns',
    question: 'Can I exchange an item instead of a refund?',
    answer: 'Yes, exchanges for alternative sizes, colors, or different merchandise are fully complimentary. Please submit a request on our `/contact` page with the subject "Product Exchange", or consult our live support agents for immediate reservation assistance.'
  },
  {
    id: 'acc-google',
    category: 'accounts',
    question: 'How does the Google Login option work?',
    answer: 'We support passwordless credentials utilizing Google Auth. Click "Sign in with Google" during login to register or log in instantly. It is safe, lightweight, and managed through Google\'s verified oauth client API.'
  },
  {
    id: 'acc-recover',
    category: 'accounts',
    question: 'How do I recover a lost password or change my details?',
    answer: 'If you register via standard credentials, you can trigger a password recovery link directly from our `/login` portal. For details updates like shipping registry address, navigate to your client administrative settings once logged in.'
  }
]

// Accordion Question Component
function AccordionItem({ 
  id, 
  question, 
  answer, 
  isOpen, 
  onToggle 
}: { 
  id: string
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void 
}) {
  return (
    <div className="border border-surface-container/60 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none cursor-pointer group"
      >
        <span className="text-xs sm:text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors pr-4">
          {question}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`} 
        />
      </button>
      
      {/* Smooth Expand Wrapper */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[300px] border-t border-slate-50' : 'max-h-0'
        } overflow-hidden`}
      >
        <p className="px-6 py-5 text-xs text-on-surface-variant leading-relaxed font-medium bg-slate-50/50">
          {answer}
        </p>
      </div>
    </div>
  )
}

// Suspense-wrapped Inner Component to leverage useSearchParams safely
function FAQContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Parse URL Parameters on mount to pre-expand a category
  useEffect(() => {
    const catParam = searchParams.get('cat')
    const hashParam = window.location.hash.replace('#', '')

    if (catParam) {
      setActiveCategory(catParam)
    }
    
    if (hashParam) {
      // Find item with matched hash or id and expand it
      const matched = faqData.find(item => item.id === hashParam)
      if (matched) {
        setExpandedItems({ [matched.id]: true })
        // Scroll smoothly to item
        setTimeout(() => {
          const el = document.getElementById(hashParam)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 300)
      }
    }
  }, [searchParams])

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  // Filter Data based on search and category selections
  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = [
    { id: 'all', label: 'All FAQs', icon: HelpCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'accounts', label: 'Accounts', icon: User }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Sidebar navigation & query filter */}
      <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
        
        {/* Live Search Inputs */}
        <div className="bg-white border border-surface-container/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
            Search Registry
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find quick answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-surface-container/60 rounded-2xl pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-primary transition-all text-on-surface font-semibold placeholder:text-slate-400 shadow-inner"
            />
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="bg-white border border-surface-container/60 rounded-3xl p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pb-1 border-b border-slate-50">
            Topic Categories
          </h3>
          <div className="flex flex-col gap-1.5 pt-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'text-on-surface-variant hover:bg-slate-50/50 hover:text-on-surface'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-on-surface-variant/60'}`} />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* Right Column: Dynamic Expandable Accordion List */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-center border-b border-surface-container/60 pb-4">
          <h2 className="text-lg font-black text-on-surface capitalize">
            {activeCategory} FAQ Directory
          </h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} found
          </span>
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {filteredFAQs.map((item) => (
              <div id={item.id} key={item.id}>
                <AccordionItem
                  id={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={!!expandedItems[item.id]}
                  onToggle={() => toggleItem(item.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-surface-container/60 rounded-3xl p-8 shadow-sm space-y-4 animate-fade-in">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-on-surface">No inquiries match your query</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                Try modifying your terms or search another category. Alternatively, launch the Store AI Concierge or open a help ticket.
              </p>
            </div>
            <div className="pt-2 flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                }}
                className="border border-surface-container/80 text-on-surface font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Clear Search filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Page Hero Header */}
      <section className="bg-slate-900 text-white py-20 px-6 lg:px-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 inline-block">
            Information Registry
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Quick, comprehensive answers regarding secure card payments, luxury logistics pipelines, return options, and Google account credentials.
          </p>
        </div>
      </section>

      {/* Interactive Main FAQ Block */}
      <section className="flex-1 max-w-7xl mx-auto w-full py-16 px-6 lg:px-16">
        
        {/* Suspense is required for safe useSearchParams App Router static pre-compilation */}
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <span className="text-xs font-bold text-slate-500">Loading FAQ Registry Directory...</span>
          </div>
        }>
          <FAQContent />
        </Suspense>

        {/* Custom Support Banner */}
        <div className="mt-20 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
          
          <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <MessageSquare className="w-5 h-5 text-primary-container" />
            </div>
            <span className="text-[9px] font-extrabold text-primary-container uppercase tracking-widest block">
              Still seeking assistance?
            </span>
            <h3 className="text-xl font-extrabold tracking-tight">Connect with a real expert</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              If our FAQ database did not fully resolve your inquiry, please submit a customized ticket or contact our VIP AI assistant for active assistance.
            </p>
          </div>

          <div className="mt-6 md:mt-0 relative z-10 flex gap-3 flex-shrink-0">
            <Link 
              href="/contact"
              className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-extrabold text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors"
            >
              <span>File Help Ticket</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </Link>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  )
}

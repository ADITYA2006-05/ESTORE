'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Loader2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: ''
  })
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    let valid = true
    const newErrors = { name: '', email: '', message: '' }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.'
      valid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.'
      valid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email address is required.'
      valid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
      valid = false
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message content cannot be blank.'
      valid = false
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error dynamically as the user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate luxury API server communication
    await new Promise(resolve => setTimeout(resolve, 1800))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      topic: 'general',
      message: ''
    })
    setIsSubmitted(false)
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Page Hero Header */}
      <section className="bg-slate-900 text-white py-20 px-6 lg:px-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 inline-block">
            Support Registry
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Connect with us
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Our specialized support team and VIP luxury concierge are standing by to assist with checkout, custom curation, or order logistics.
          </p>
        </div>
      </section>

      {/* Split Grid Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full py-16 px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Office details, direct support handles */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-block">
                Corporate Office
              </span>
              <h2 className="text-3xl font-extrabold text-on-surface leading-tight">
                Luxury Headquarters
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Experience outstanding care. We reply to all digital inquiries within **2 to 4 business hours** with dedicated senior account support staff.
              </p>
            </div>

            <div className="space-y-6">
              {/* Contact Handles */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border border-surface-container/60 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mailing Address</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    E-Store VIP Tower, Luxury Plaza,<br />
                    Golf Course Road, DLF Phase 5,<br />
                    Gurugram, Haryana - 122002, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border border-surface-container/60 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Email Correspondence</h4>
                  <p className="text-xs text-primary font-bold">
                    <a href="mailto:support@estore.vip" className="hover:underline">support@estore.vip</a>
                  </p>
                  <p className="text-[11px] text-on-surface-variant/70">
                    For VIP concierge inquiries: <a href="mailto:concierge@estore.vip" className="hover:underline">concierge@estore.vip</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border border-surface-container/60 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Direct Hotline</h4>
                  <p className="text-xs text-on-surface-variant font-bold">
                    +91 124 555 9999 &bull; +91 1800 300 2026
                  </p>
                  <p className="text-[11px] text-on-surface-variant/70">
                    Toll-free customer line within India.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border border-surface-container/60 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Business Hours</h4>
                  <p className="text-xs text-on-surface-variant">
                    Monday &ndash; Saturday &bull; 09:00 AM &ndash; 09:00 PM IST
                  </p>
                  <p className="text-[11px] text-on-surface-variant/70">
                    24/7 AI Concierge available via floating assistant.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Guarantee Info Box */}
            <div className="bg-slate-50 border border-surface-container/60 p-6 rounded-3xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">Corporate Integrity Promise</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Every inquiry receives personalized attention. No automated templates or standard copy-paste scripts. We solve problems.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form Layout */}
          <div className="lg:col-span-7 bg-white border border-surface-container/60 rounded-3xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
            
            {/* Form Success Overlay */}
            {isSubmitted ? (
              <div className="py-12 px-4 text-center space-y-6 animate-fade-in flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-on-surface">Ticket Successfully Logged</h3>
                  <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your support query has been logged under priority registry ticket <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong>.
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-2 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                    A confirmation log has been queued to <strong>{formData.email}</strong>. Our senior agent will contact you shortly.
                  </p>
                </div>
                <div className="pt-4 flex gap-3 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 border border-surface-container/80 text-on-surface font-extrabold text-xs py-3.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Send another query
                  </button>
                  <Link
                    href="/"
                    className="flex-1 bg-primary text-white font-extrabold text-xs py-3.5 rounded-xl text-center hover:bg-primary-container transition-colors shadow-sm"
                  >
                    Back to Store
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-on-surface">Submit a secure ticket</h3>
                  <p className="text-xs text-on-surface-variant">
                    Please provide complete details so we can assist you efficiently.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-slate-700 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Aditya Verma"
                      disabled={isSubmitting}
                      className={`w-full bg-slate-50 border ${
                        errors.name ? 'border-red-500 bg-red-50/10' : 'border-surface-container/60 focus:border-primary'
                      } rounded-xl px-4 py-3 text-xs focus:outline-none transition-all text-on-surface font-medium placeholder:text-slate-400`}
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-500 font-bold block">{errors.name}</span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-slate-700 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. aditya@domain.com"
                      disabled={isSubmitting}
                      className={`w-full bg-slate-50 border ${
                        errors.email ? 'border-red-500 bg-red-50/10' : 'border-surface-container/60 focus:border-primary'
                      } rounded-xl px-4 py-3 text-xs focus:outline-none transition-all text-on-surface font-medium placeholder:text-slate-400`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 font-bold block">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Topic Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="topic" className="text-xs font-bold text-slate-700 block">
                    Inquiry Topic
                  </label>
                  <div className="relative">
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-surface-container/60 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer text-on-surface font-semibold"
                    >
                      <option value="general">General Store Assistance</option>
                      <option value="orders">Order Tracking & Modifications</option>
                      <option value="payments">Razorpay Billing & Failures</option>
                      <option value="returns">Product Returns & Exchanges</option>
                      <option value="concierge">VIP Custom Curation Service</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-slate-700 block">
                    Message Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide a thorough explanation (minimum 10 characters)..."
                    disabled={isSubmitting}
                    className={`w-full bg-slate-50 border ${
                      errors.message ? 'border-red-500 bg-red-50/10' : 'border-surface-container/60 focus:border-primary'
                    } rounded-xl px-4 py-3 text-xs focus:outline-none transition-all text-on-surface font-medium placeholder:text-slate-400 resize-none leading-relaxed`}
                  />
                  {errors.message && (
                    <span className="text-[10px] text-red-500 font-bold block">{errors.message}</span>
                  )}
                </div>

                {/* Submit button with loader */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white font-extrabold text-xs py-4 rounded-xl shadow-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Inquiry Registry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Secure Support Ticket</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Floating Concierge Action Card */}
        <div className="mt-20 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <Sparkles className="w-5 h-5 text-primary-container" />
            </div>
            <span className="text-[9px] font-extrabold text-primary-container uppercase tracking-widest block">
              Automated Support Channels
            </span>
            <h3 className="text-xl font-extrabold tracking-tight">Need an instant, smart resolution?</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Skip the forms entirely. Our AI Concierge is loaded with shipping guidelines, refund policies, and tracking details to resolve inquiries immediately.
            </p>
          </div>

          <div className="mt-6 md:mt-0 relative z-10 flex-shrink-0">
            <button 
              type="button"
              onClick={() => {
                const button = document.querySelector('button[class*="rounded-full"][class*="shadow-level2"]') as HTMLButtonElement
                if (button) button.click()
              }}
              className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-extrabold text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors"
            >
              <span>Launch Store AI</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, ArrowRight, ShieldCheck, Mail, User as UserIcon } from 'lucide-react'
import Script from 'next/script'

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

interface GoogleProfile {
  name: string
  email: string
}

interface GoogleSSOPopupProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (profile: GoogleProfile) => void
}

export default function GoogleSSOPopup({ isOpen, onClose, onSelect }: GoogleSSOPopupProps) {
  const [loadingProfile, setLoadingProfile] = useState<string | null>(null)
  
  // Custom input state
  const [customMode, setCustomMode] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [customError, setCustomError] = useState('')

  const [gsiLoaded, setGsiLoaded] = useState(false)
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  const hasClientId = clientId.trim().length > 0

  useEffect(() => {
    if (!isOpen || !hasClientId) return

    let active = true

    const initGoogleSignIn = () => {
      if (!active) return
      const google = (window as any).google
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (!active) return
            const payload = parseJwt(response.credential)
            if (payload && payload.email) {
              handleSelectPreset({
                name: payload.name || payload.given_name || 'Google User',
                email: payload.email
              })
            }
          }
        })

        const btnContainer = document.getElementById('google-signin-btn')
        if (btnContainer) {
          google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'signin_with',
            shape: 'rectangular'
          })
        }
      }
    }

    const interval = setInterval(() => {
      const google = (window as any).google
      const btnContainer = document.getElementById('google-signin-btn')
      if (google && google.accounts && google.accounts.id && btnContainer) {
        initGoogleSignIn()
        clearInterval(interval)
      }
    }, 100)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [isOpen, gsiLoaded, hasClientId, clientId])

  const presets = [
    {
      name: 'Sophia Chen',
      email: 'sophia.chen@design.com',
      avatar: 'SC',
      desc: 'Minimalist Interior Architect'
    },
    {
      name: 'Alex Mercer',
      email: 'alex.mercer@gmail.com',
      avatar: 'AM',
      desc: 'Technical Apparel Designer'
    }
  ]

  const handleSelectPreset = async (profile: GoogleProfile) => {
    setLoadingProfile(profile.email)
    // Simulate OAuth connection delay
    await new Promise((resolve) => setTimeout(resolve, 900))
    onSelect(profile)
    setLoadingProfile(null)
  }

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCustomError('')

    if (!customName.trim() || !customEmail.trim()) {
      setCustomError('Please fill out both Name and Email.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customEmail.trim())) {
      setCustomError('Please enter a valid Google email address.')
      return
    }

    const profile = {
      name: customName.trim(),
      email: customEmail.trim().toLowerCase()
    }

    setLoadingProfile(profile.email)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSelect(profile)
    setLoadingProfile(null)
    setCustomMode(false)
    setCustomName('')
    setCustomEmail('')
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setGsiLoaded(true)}
        strategy="afterInteractive"
      />
      <AnimatePresence>
        {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Blackout backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[400px] bg-white rounded-3xl border border-surface-container shadow-level4 overflow-hidden flex flex-col font-sans"
          >
            {/* Google Brand Header */}
            <div className="p-6 border-b border-surface-container bg-background/40 flex flex-col items-center text-center">
              {/* Fake Google Logo */}
              <div className="flex gap-0.5 text-lg font-bold font-sans tracking-tight mb-3">
                <span className="text-blue-500 font-extrabold">G</span>
                <span className="text-red-500 font-extrabold">o</span>
                <span className="text-yellow-500 font-extrabold">o</span>
                <span className="text-blue-500 font-extrabold">g</span>
                <span className="text-green-500 font-extrabold">l</span>
                <span className="text-red-500 font-extrabold">e</span>
              </div>
              <h3 className="text-base font-extrabold text-on-surface">
                Sign in with Google
              </h3>
              <p className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-wider mt-1">
                to continue to ESTORE
              </p>
            </div>

            {/* Content Arena */}
            <div className="p-6 flex-1 bg-white">
              {loadingProfile ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <div>
                    <span className="text-xs font-bold text-on-surface block">
                      Connecting secure Google Auth...
                    </span>
                    <span className="text-[10px] text-on-surface-variant/50 font-mono block mt-1">
                      {loadingProfile}
                    </span>
                  </div>
                </div>
              ) : hasClientId ? (
                /* Genuine Google Sign-In button container */
                <div className="py-12 flex flex-col items-center justify-center text-center gap-6 animate-fadeIn">
                  <div id="google-signin-btn" className="flex justify-center min-h-[40px] min-w-[200px]" />
                  <p className="text-[11px] font-semibold text-on-surface-variant/60 leading-relaxed max-w-[280px]">
                    Click above to authenticate securely using your Google Account.
                  </p>
                </div>
              ) : customMode ? (
                /* Custom Google Account Form */
                <form onSubmit={handleCustomSubmit} className="space-y-4 animate-fadeIn">
                  <h4 className="text-xs font-extrabold text-on-surface uppercase tracking-wider block mb-1">
                    Enter Google Profile
                  </h4>
                  
                  {customError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-[11px] font-semibold rounded-lg">
                      {customError}
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-3.5 h-3.5 text-on-surface-variant/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-background border border-surface-container rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors font-medium text-on-surface"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                        Google Email
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-on-surface-variant/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          placeholder="e.g. johndoe@gmail.com"
                          className="w-full bg-background border border-surface-container rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors font-medium text-on-surface"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomMode(false)
                        setCustomError('')
                      }}
                      className="flex-1 px-4 py-2 border border-surface-container text-on-surface font-semibold rounded-xl text-xs hover:bg-background cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl text-xs hover:bg-blue-600 cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      Continue
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                /* Preset Accounts List */
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col gap-1.5">
                    <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">
                      Developer SSO Sandbox
                    </span>
                    <span className="text-[9px] font-semibold text-blue-900/60 leading-relaxed block">
                      Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in your environment file to connect real credentials.
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest block">
                    Choose an Account
                  </span>
                  
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.email}
                        onClick={() => handleSelectPreset(preset)}
                        className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-surface-container hover:border-blue-300 hover:bg-blue-50/20 text-left transition-all cursor-pointer group"
                      >
                        {/* Profile Initial Badge */}
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-blue-600 text-sm flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          {preset.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-extrabold text-xs block text-on-surface group-hover:text-blue-600 transition-colors">
                            {preset.name}
                          </span>
                          <span className="text-[10px] font-medium text-on-surface-variant/75 block truncate">
                            {preset.email}
                          </span>
                          <span className="text-[9px] font-bold text-on-surface-variant/40 block mt-0.5 uppercase tracking-wider">
                            {preset.desc}
                          </span>
                        </div>
                      </button>
                    ))}

                    {/* Use another account selector */}
                    <button
                      onClick={() => setCustomMode(true)}
                      className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-surface-container hover:border-blue-400 hover:bg-blue-50/10 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full border border-dashed border-surface-container flex items-center justify-center text-on-surface-variant/60 flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-200 transition-all">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block text-on-surface-variant group-hover:text-blue-600 transition-colors">
                          Use another Google account
                        </span>
                        <span className="text-[9px] font-medium text-on-surface-variant/40 block tracking-wider uppercase mt-0.5">
                          Custom Name & Email
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Google Secure Footer */}
            <div className="p-4 border-t border-surface-container bg-background/30 flex items-center justify-center gap-2 text-center text-on-surface-variant/50 text-[10px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>
                {hasClientId 
                  ? 'Google Identity Services (OAuth 2.0) Active' 
                  : 'Google Secure SSO Sandbox Environment'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  )
}

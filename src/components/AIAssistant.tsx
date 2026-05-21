'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, User, CornerDownLeft, RefreshCw, HelpCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to ESTORE! 👋

I am your local **AI Concierge**, connected to our product inventory and store knowledge.

Ask me about our **minimalist philosophy**, **shipping policies**, **admin dashboard credentials**, or *ask to search for products* across Apparel, Accessories, Home, Food, Daily Wear, and Electronics!`,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100)
    }
  }, [isOpen, messages, isLoading])

  // Simple Markdown-to-HTML parser for rich responses
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      let trimmed = line.trim()
      
      // Headers ###
      if (trimmed.startsWith('### ')) {
        const headerText = trimmed.replace('### ', '')
        return (
          <h4 key={idx} className="text-sm font-extrabold text-primary tracking-wider uppercase mt-4 mb-2 first:mt-1 flex items-center gap-1.5 border-b border-surface-container/60 pb-1">
            {parseInlineMarkdown(headerText)}
          </h4>
        )
      }

      // Headers ##
      if (trimmed.startsWith('## ')) {
        const headerText = trimmed.replace('## ', '')
        return (
          <h3 key={idx} className="text-base font-extrabold text-primary tracking-tight mt-4 mb-2 first:mt-1 border-b border-surface-container/60 pb-1">
            {parseInlineMarkdown(headerText)}
          </h3>
        )
      }

      // Bullets - or *
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.substring(2)
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed text-on-surface-variant/90 my-1">
            {parseInlineMarkdown(bulletText)}
          </li>
        )
      }

      // Empty line
      if (trimmed === '') {
        return <div key={idx} className="h-2" />
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-xs leading-relaxed text-on-surface my-1.5">
          {parseInlineMarkdown(line)}
        </p>
      )
    })
  }

  // Parse bold (**), code (`), and links ([text](/path))
  const parseInlineMarkdown = (text: string) => {
    let parts: React.ReactNode[] = []
    let currentText = text
    let keyIdx = 0

    // Bold pattern: **text**
    // Code pattern: `text`
    // Link pattern: [text](url)
    
    // We can do a manual iterative parse or simple split replacements
    // For local convenience, let's parse using regex tokenization
    const tokenRegex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g
    const tokens = currentText.split(tokenRegex)

    if (tokens.length === 1) {
      return text
    }

    return tokens.map((token, index) => {
      // Bold
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-on-surface">{token.slice(2, -2)}</strong>
      }
      // Inline Code
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={index} className="bg-primary/5 text-primary text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
            {token.slice(1, -1)}
          </code>
        )
      }
      // Markdown Link
      if (token.startsWith('[') && token.includes('](')) {
        const match = token.match(/\[(.*?)\]\((.*?)\)/)
        if (match) {
          const linkText = match[1]
          const linkUrl = match[2]
          return (
            <a 
              key={index} 
              href={linkUrl} 
              className="text-primary hover:text-secondary underline font-bold cursor-pointer transition-colors"
            >
              {linkText}
            </a>
          )
        }
      }

      return token
    })
  }

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.response || 'I processed your query, but could not produce a matching output.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: `### ❌ Connection Interrupted

I experienced an issue communicating with the store API database. Please make sure the backend dev server is active and try again!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestions = [
    { label: 'Do you sell electronics? ⚡', query: 'Show me your electronics products' },
    { label: 'Artisan Matcha Tea? 🍵', query: 'Do you sell matcha tea?' },
    { label: 'Login as Admin? 🔒', query: 'How do I log into the admin dashboard?' },
    { label: 'Return Policy? 📦', query: 'What is your refund policy?' }
  ]

  return (
    <>
      {/* Floating Sparkles Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-level2 hover:shadow-level3 transition-colors ${
            isOpen ? 'bg-white border border-surface-container text-on-surface' : 'bg-primary text-white'
          }`}
        >
          {/* Subtle Outer Radar Wave when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
          )}
          
          {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-white" />}
        </motion.button>
      </div>

      {/* Expanded Glassmorphic Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] z-[100] bg-white/90 backdrop-blur-xl border border-surface-container/80 rounded-3xl shadow-level3 flex flex-col overflow-hidden"
          >
            {/* Elegant Header Banner */}
            <div className="bg-gradient-to-r from-primary via-primary/95 to-secondary px-6 py-5 flex items-center justify-between text-white shadow-sm flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                    Store AI Concierge
                  </h4>
                  <span className="text-[10px] font-medium text-white/70 block tracking-widest uppercase">
                    Connected to Inventory
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Conversation Arena */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background/30 to-background/10">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3.5 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-white border border-surface-container text-primary'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary/5 border border-primary/20 text-on-surface rounded-tr-none'
                      : 'bg-white border border-surface-container/60 text-on-surface rounded-tl-none shadow-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="text-xs leading-relaxed font-semibold">{msg.content}</p>
                    ) : (
                      <div className="space-y-0.5 prose prose-sm max-w-none text-xs">
                        {renderMarkdown(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Bot Typing Loader */}
              {isLoading && (
                <div className="flex gap-3.5 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-white border border-surface-container text-primary flex items-center justify-center shadow-sm">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-4 bg-white border border-surface-container/60 text-on-surface rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips Carousel */}
            <div className="px-6 py-3 border-t border-surface-container/40 flex items-center gap-2 overflow-x-auto scrollbar-none bg-white flex-shrink-0">
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  className="px-3.5 py-1.5 bg-background border border-surface-container hover:border-primary hover:bg-primary/5 transition-all text-[11px] font-bold rounded-full cursor-pointer flex-shrink-0 shadow-sm text-on-surface-variant hover:text-primary flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Footer Input Board */}
            <div className="p-4 bg-white border-t border-surface-container flex-shrink-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }}
                className="flex items-center gap-2 relative bg-background border border-surface-container rounded-2xl pl-4 pr-2.5 py-2.5 focus-within:border-primary transition-all shadow-inner"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask our AI Concierge anything..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none text-xs font-semibold focus:ring-0 focus:outline-none placeholder:text-on-surface-variant/40 text-on-surface"
                />
                
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
              <span className="text-[9px] font-semibold text-on-surface-variant/35 text-center block mt-2 tracking-widest uppercase">
                Zero-setup Local AI Assistant Powered by SQLite
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

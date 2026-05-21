'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  Clock, MapPin, Truck, MessageSquare, Send, Sparkles, 
  Package, CheckCircle, Home, Compass, ArrowRight, User, 
  ChevronRight, Calendar, AlertCircle, RefreshCw
} from 'lucide-react'

// Wrap search params extraction in a Suspense boundary for Next.js build static compliance
export default function DeliveryPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-bold text-on-surface-variant animate-pulse">Initializing Tracking Terminal...</p>
        </div>
      </div>
    }>
      <DeliveryContent />
    </Suspense>
  )
}

interface Message {
  sender: 'customer' | 'courier'
  text: string
  time: string
}

function DeliveryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Tracking states
  const [status, setStatus] = useState<'Placed' | 'Processing' | 'In Transit' | 'Delivered'>('Placed')
  const [etaMinutes, setEtaMinutes] = useState(25)
  const [etaSeconds, setEtaSeconds] = useState(0)

  // Chat simulator states
  const [chatOpen, setChatOpen] = useState(true)
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'courier', 
      text: "Hi there! I am Rohan, your personal delivery agent today. I am preparing your package at the logistics warehouse now. Feel free to leave any special notes or gate codes for me here!", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ])

  // Map settings
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progressVal, setProgressVal] = useState(0) // 0 to 1 for truck progression

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Fetch Order details on load
  useEffect(() => {
    if (!orderId) {
      setError('No order key provided. Go to shop page first.')
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          throw new Error('Order not found in database')
        }
        const data = await res.json()
        setOrder(data)
        setStatus(data.status as any)

        // Set initial ETA based on order status
        if (data.status === 'Placed') {
          setEtaMinutes(25)
          setProgressVal(0.0)
        } else if (data.status === 'Processing') {
          setEtaMinutes(18)
          setProgressVal(0.25)
        } else if (data.status === 'In Transit') {
          setEtaMinutes(8)
          setProgressVal(0.65)
        } else if (data.status === 'Delivered') {
          setEtaMinutes(0)
          setEtaSeconds(0)
          setProgressVal(1.0)
        }
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load logistics telemetry')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ETA Ticking countdown
  useEffect(() => {
    if (status === 'Delivered') {
      setEtaMinutes(0)
      setEtaSeconds(0)
      return
    }

    const timer = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 0) {
          if (etaMinutes <= 0) {
            clearInterval(timer)
            return 0
          }
          setEtaMinutes(m => Math.max(0, m - 1))
          return 59
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [status, etaMinutes])

  // Update Database Order Status on transitions
  const updateDatabaseStatus = async (newStatus: string) => {
    if (!orderId) return
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
    } catch (err) {
      console.error('Failed to sync state to server:', err)
    }
  }

  // Smooth transit simulation helper (Natural automatic transition)
  useEffect(() => {
    if (status === 'Delivered' || !order) return

    const interval = setTimeout(() => {
      let nextStatus: 'Placed' | 'Processing' | 'In Transit' | 'Delivered' = 'Placed'
      let minutes = 25

      if (status === 'Placed') {
        nextStatus = 'Processing'
        minutes = 18
      } else if (status === 'Processing') {
        nextStatus = 'In Transit'
        minutes = 8
      } else if (status === 'In Transit') {
        nextStatus = 'Delivered'
        minutes = 0
      }

      setStatus(nextStatus)
      setEtaMinutes(minutes)
      setEtaSeconds(0)
      updateDatabaseStatus(nextStatus)

      // Post status milestone update to courier chat
      let courierText = ""
      if (nextStatus === 'Processing') {
        courierText = "Order picked & packed! I'm doing the final inspection at our central node. Ready to depart shortly."
      } else if (nextStatus === 'In Transit') {
        courierText = "I am on the road! Departed the shipping gateway. Your package is safely strapped in. Running slightly ahead of schedule!"
      } else if (nextStatus === 'Delivered') {
        courierText = "Order successfully delivered! Dropped it off exactly as requested. Snap photo stored. Thank you for shopping with ESTORE. Have a wonderful day!"
      }

      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'courier', 
            text: courierText, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ])
      }, 2000)

    }, 35000) // Advances every 35 seconds to keep demo fast and lively

    return () => clearTimeout(interval)
  }, [status, order])

  // Interactive Developer Quick Controls
  const handleSetStatus = (newStatus: 'Placed' | 'Processing' | 'In Transit' | 'Delivered') => {
    setStatus(newStatus)
    let minutes = 25
    let val = 0.0

    if (newStatus === 'Placed') {
      minutes = 25
      val = 0.0
    } else if (newStatus === 'Processing') {
      minutes = 18
      val = 0.25
    } else if (newStatus === 'In Transit') {
      minutes = 8
      val = 0.65
    } else if (newStatus === 'Delivered') {
      minutes = 0
      val = 1.0
    }

    setEtaMinutes(minutes)
    setEtaSeconds(0)
    setProgressVal(val)
    updateDatabaseStatus(newStatus)

    // Append alert in chat from courier
    let text = `[System Status Update] Order status manually updated to: ${newStatus}`
    if (newStatus === 'Placed') text = "System reset: Packaging items at warehouse terminal."
    else if (newStatus === 'Processing') text = "Processing package. Printing priority labels and performing luxury verification scan."
    else if (newStatus === 'In Transit') text = "Package is en route. Truck position updated on active vector telemetry map."
    else if (newStatus === 'Delivered') text = "Package dropped off. Hand-delivered or left at designated parcel checkpoint."

    setMessages(prev => [
      ...prev,
      { 
        sender: 'courier', 
        text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ])
  }

  // Animate truck coordinate interpolation on canvas
  useEffect(() => {
    let target = 0
    if (status === 'Placed') target = 0.0
    else if (status === 'Processing') target = 0.25
    else if (status === 'In Transit') target = 0.65
    else if (status === 'Delivered') target = 1.0

    // Smoothly slide progressVal toward target
    const step = () => {
      setProgressVal((prev) => {
        const diff = target - prev
        if (Math.abs(diff) < 0.01) return target
        return prev + diff * 0.05 // exponential spring ease
      })
    }
    const animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [status, progressVal])

  // Canvas Vector Map Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    // Bezier Curve points representing delivery route
    const p0 = { x: 50, y: 220 }    // Depot Start
    const p1 = { x: 200, y: 60 }    // Winding point 1
    const p2 = { x: 300, y: 260 }   // Winding point 2
    const p3 = { x: 450, y: 110 }   // Customer House End

    // Cubic Bezier interpolation
    const getCubicBezierPoint = (t: number) => {
      const x = Math.pow(1 - t, 3) * p0.x + 
                3 * Math.pow(1 - t, 2) * t * p1.x + 
                3 * (1 - t) * Math.pow(t, 2) * p2.x + 
                Math.pow(t, 3) * p3.x
      const y = Math.pow(1 - t, 3) * p0.y + 
                3 * Math.pow(1 - t, 2) * t * p1.y + 
                3 * (1 - t) * Math.pow(t, 2) * p2.y + 
                Math.pow(t, 3) * p3.y
      return { x, y }
    }

    const drawMap = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw subtle grid lines
      ctx.strokeStyle = '#f1f5f9'
      ctx.lineWidth = 1
      const gridSize = 25
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw original dotted full route path
      ctx.beginPath()
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 4
      ctx.setLineDash([6, 8])
      for (let t = 0; t <= 1; t += 0.01) {
        const pt = getCubicBezierPoint(t)
        if (t === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()
      ctx.setLineDash([]) // Reset

      // Draw elapsed solid tracking path (Teal primary glow)
      ctx.beginPath()
      ctx.strokeStyle = '#2f6760'
      ctx.lineWidth = 5
      for (let t = 0; t <= progressVal; t += 0.01) {
        const pt = getCubicBezierPoint(t)
        if (t === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()

      // Draw Depot Hub Icon (Start node)
      ctx.beginPath()
      ctx.arc(p0.x, p0.y, 10, 0, 2 * Math.PI)
      ctx.fillStyle = '#404947'
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = '#ffffff'
      ctx.stroke()

      // Label Hub
      ctx.font = 'bold 9px sans-serif'
      ctx.fillStyle = '#404947'
      ctx.fillText('ESTORE DEPOT', p0.x - 30, p0.y + 22)

      // Draw Customer House Icon (End node)
      ctx.beginPath()
      ctx.arc(p3.x, p3.y, 12, 0, 2 * Math.PI)
      ctx.fillStyle = '#67558c' // secondary purple theme
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = '#ffffff'
      ctx.stroke()

      ctx.fillStyle = '#67558c'
      ctx.fillText('YOUR HOME', p3.x - 22, p3.y - 20)

      // Draw moving courier dot/pulse
      const currentPos = getCubicBezierPoint(progressVal)
      
      // Outer glowing pulsing ring
      const pulseRadius = 14 + Math.sin(Date.now() / 150) * 4
      ctx.beginPath()
      ctx.arc(currentPos.x, currentPos.y, pulseRadius, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(126, 182, 173, 0.35)'
      ctx.fill()

      // Core agent point
      ctx.beginPath()
      ctx.arc(currentPos.x, currentPos.y, 8, 0, 2 * Math.PI)
      ctx.fillStyle = '#2f6760'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Animated vehicle mini marker
      ctx.font = '14px sans-serif'
      ctx.fillText('🚚', currentPos.x - 8, currentPos.y + 4)

      animationFrameId = requestAnimationFrame(drawMap)
    }

    drawMap()

    return () => cancelAnimationFrame(animationFrameId)
  }, [progressVal])

  // Courier Chat Submission & Auto-Replies
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const userText = messageInput.trim()
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Append customer message
    setMessages(prev => [...prev, { sender: 'customer', text: userText, time: timeStr }])
    setMessageInput('')

    // Fire typing indicator
    setIsTyping(true)

    // Contextual auto reply logic
    setTimeout(() => {
      const lower = userText.toLowerCase()
      let reply = "I've logged that request in your delivery tracking sheet! I'll do exactly as requested when I get to your coordinate."

      if (lower.includes('porch') || lower.includes('deck') || lower.includes('backyard')) {
        reply = "Copy that! I will place your package neatly on the porch behind the planter to keep it fully out of sight from the street. 📦"
      } else if (lower.includes('gate') || lower.includes('code') || lower.includes('buzzer') || lower.includes('ring')) {
        reply = "Received! I have written the gate/buzzer code on my tracking terminal. I'll ring you as soon as I pull into the driveway."
      } else if (lower.includes('door') || lower.includes('front')) {
        reply = "Understood. I will place it directly at your front door, snap a confirmation photo, and leave a knock so you know it's arrived safely."
      } else if (lower.includes('call') || lower.includes('phone') || lower.includes('number')) {
        reply = "Sure thing. If there are any access issues or finding the driveway is confusing, I will give you a call immediately on this line."
      } else if (lower.includes('fast') || lower.includes('hurry') || lower.includes('speed') || lower.includes('when')) {
        reply = "I'm moving as fast as speed limits and safety permit! Currently traveling down the arterial gateway towards your zip code."
      } else if (lower.includes('thank') || lower.includes('thanks') || lower.includes('awesome')) {
        reply = "You are so welcome! Happy to help you today. It is an absolute pleasure serving you."
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        reply = "Hey! Hope you are having a wonderful day. Let me know if you need any adjustments or directions for the package!"
      }

      setIsTyping(false)
      setMessages(prev => [...prev, { sender: 'courier', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    }, 2000)
  }

  // Pre-configured instruction chips
  const handleQuickNote = (noteText: string) => {
    setMessageInput(noteText)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <section className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <RefreshCw className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-on-surface-variant">Connecting with Logistics Satellite...</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <section className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-surface-container rounded-3xl p-8 shadow-level3 text-center">
            <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-extrabold mb-2">Tracking Terminated</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              {error || "We could not find active coordinates linked to this transaction key."}
            </p>
            <button 
              onClick={() => router.push('/shop')}
              className="btn-primary"
            >
              Browse Shop Catalog
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Milestone checkmarks builder
  const milestones = [
    { label: 'Placed', title: 'Order Placed', desc: 'Secure payment cleared. Packing list generated.', active: ['Placed', 'Processing', 'In Transit', 'Delivered'].includes(status) },
    { label: 'Processing', title: 'Depot Assembly', desc: 'Custom wrapping, labeling, and cargo boarding.', active: ['Processing', 'In Transit', 'Delivered'].includes(status) },
    { label: 'In Transit', title: 'En Route', desc: 'Courier vehicle dispatched. Winding along grid vector.', active: ['In Transit', 'Delivered'].includes(status) },
    { label: 'Delivered', title: 'Delivered', desc: 'Items checked and hand-off complete.', active: ['Delivered'].includes(status) }
  ]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="flex-1 max-w-7xl mx-auto w-full py-12 px-6 lg:px-16 space-y-10">
        
        {/* Telemetry Header Alert Card */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-surface-container/60 rounded-3xl p-6 md:p-8 shadow-level2 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
              Active Shipment Telemetry
            </span>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Order {order.id.substring(0, 10).toUpperCase()}
              </h1>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary animate-pulse'
              }`}>
                {status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              Recipient: <span className="text-on-surface font-semibold">{order.customerName}</span> &nbsp;|&nbsp; Destination: <span className="text-on-surface font-semibold">{order.shippingAddress}, {order.zipCode}</span>
            </p>
          </div>

          {/* ETA Clock Box */}
          <div className="relative z-10 bg-primary text-white rounded-2xl p-4 md:p-6 text-center shadow-md flex md:flex-col items-center justify-center gap-2 md:gap-1 min-w-[200px]">
            <Clock className="w-5 h-5 text-primary-container" />
            <div>
              <span className="text-[10px] font-bold text-primary-container/85 uppercase tracking-widest block">
                Estimated Delivery
              </span>
              <span className="text-xl md:text-2xl font-black font-mono block">
                {status === 'Delivered' ? (
                  'ARRIVED!'
                ) : (
                  `${String(etaMinutes).padStart(2, '0')}:${String(etaSeconds).padStart(2, '0')}`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tracking Map & Milestones (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Visual HTML5 Canvas Map */}
            <div className="bg-white border border-surface-container/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-surface-container/40 pb-4">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" />
                  Courier Vector Route Track
                </h3>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider bg-background px-3 py-1 rounded-full">
                  GPS Active
                </span>
              </div>

              {/* Responsive canvas wrapping */}
              <div className="bg-background border border-surface-container rounded-2xl overflow-hidden relative flex items-center justify-center">
                <canvas 
                  ref={canvasRef} 
                  width={500} 
                  height={300} 
                  className="w-full max-w-[500px] h-[300px] block"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold px-2 pt-2">
                <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> LOGISTICS CENTER</span>
                <span className="text-primary font-bold uppercase tracking-widest animate-pulse">
                  {status === 'Placed' && 'Dispatch Scheduled...'}
                  {status === 'Processing' && 'Inspection in Progress'}
                  {status === 'In Transit' && 'En Route to Destination'}
                  {status === 'Delivered' && 'Package Handed Over'}
                </span>
                <span className="flex items-center gap-1.5"><Home className="w-3.5 h-3.5" /> RESIDENCE</span>
              </div>
            </div>

            {/* Milestones list */}
            <div className="bg-white border border-surface-container/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-extrabold flex items-center gap-2 border-b border-surface-container/40 pb-4">
                <CheckCircle className="w-5 h-5 text-primary" />
                Transit Checklist History
              </h3>

              <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
                {milestones.map((ms, index) => (
                  <div key={index} className="relative flex items-start gap-4 animate-fadeIn">
                    {/* Ring Bullet */}
                    <div className={`absolute -left-[20px] w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      ms.active 
                        ? 'bg-primary border-primary text-white shadow-sm' 
                        : 'bg-white border-surface-container text-on-surface-variant/40'
                    }`}>
                      {ms.active ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-2 h-2 bg-on-surface-variant/40 rounded-full" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className={`text-sm font-bold ${ms.active ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                        {ms.title}
                      </h4>
                      <p className={`text-xs ${ms.active ? 'text-on-surface-variant' : 'text-on-surface-variant/40'}`}>
                        {ms.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courier Chat Panel (Col 5) */}
          <div className="lg:col-span-5 bg-white border border-surface-container/60 rounded-3xl p-6 shadow-sm flex flex-col h-[580px]">
            <div className="flex items-center gap-3 border-b border-surface-container/40 pb-4 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-secondary text-white font-extrabold flex items-center justify-center shadow-md">
                  R
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-ping" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-on-surface">Rohan (Your Courier)</h4>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Active Messaging Live</p>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'} animate-scaleIn`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-semibold shadow-sm ${
                    msg.sender === 'customer' 
                      ? 'bg-secondary text-white rounded-tr-none' 
                      : 'bg-background text-on-surface rounded-tl-none border border-surface-container'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-on-surface-variant/50 font-bold mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-background border border-surface-container/60 rounded-2xl px-4 py-3 text-xs w-28 rounded-tl-none animate-pulse">
                  <span className="text-on-surface-variant font-semibold">Courier typing</span>
                  <span className="flex gap-0.5 mt-1 font-black">
                    <span className="w-1 h-1 bg-on-surface rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-1 bg-on-surface rounded-full animate-bounce delay-150" />
                    <span className="w-1 h-1 bg-on-surface rounded-full animate-bounce delay-200" />
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick action note chips */}
            {status !== 'Delivered' && (
              <div className="flex flex-wrap gap-2 mb-3">
                <button 
                  onClick={() => handleQuickNote("Please leave on the front porch. Thank you!")}
                  className="text-[9px] font-bold bg-background border border-surface-container/60 hover:border-primary px-2.5 py-1.5 rounded-full transition-all text-on-surface-variant hover:text-primary"
                >
                  🚪 Leave on porch
                </button>
                <button 
                  onClick={() => handleQuickNote("Please ring the doorbell when you arrive.")}
                  className="text-[9px] font-bold bg-background border border-surface-container/60 hover:border-primary px-2.5 py-1.5 rounded-full transition-all text-on-surface-variant hover:text-primary"
                >
                  🔔 Ring doorbell
                </button>
                <button 
                  onClick={() => handleQuickNote("Call my phone if locating entry is confusing.")}
                  className="text-[9px] font-bold bg-background border border-surface-container/60 hover:border-primary px-2.5 py-1.5 rounded-full transition-all text-on-surface-variant hover:text-primary"
                >
                  📞 Call my phone
                </button>
              </div>
            )}

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                disabled={status === 'Delivered'}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={status === 'Delivered' ? 'Delivery finalized.' : 'Type message to Courier Rohan...'}
                className="flex-1 bg-background border border-surface-container rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'Delivered' || !messageInput.trim()}
                className="bg-primary hover:bg-on-primary-container text-white px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Itemized Order Details & Billing panel */}
        <div className="bg-white border border-surface-container/60 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-extrabold flex items-center gap-2 border-b border-surface-container/40 pb-4 mb-6">
            <Package className="w-5 h-5 text-primary" />
            Itemized Invoiced Manifest
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Purchase List (Col 8) */}
            <div className="md:col-span-8 divide-y divide-surface-container">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-5 py-4 first:pt-0">
                    <div className="w-16 h-16 bg-background rounded-2xl overflow-hidden border border-surface-container/60 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-extrabold text-sm text-on-surface truncate">{item.name}</h4>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                        Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-extrabold text-sm text-on-surface self-center pr-2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant py-4">No itemized products logged in ledger.</p>
              )}
            </div>

            {/* Address & Payment Receipt Details (Col 4) */}
            <div className="md:col-span-4 bg-background border border-surface-container/80 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-secondary uppercase tracking-widest border-b border-surface-container/60 pb-2">
                Order Billing Ledger
              </h4>
              
              <div className="space-y-3 text-xs font-semibold text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Receiver</span>
                  <span className="text-on-surface font-bold">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address</span>
                  <span className="text-on-surface font-bold truncate max-w-[150px]">{order.shippingAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email</span>
                  <span className="text-on-surface font-bold truncate max-w-[150px]">{order.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zip Code</span>
                  <span className="text-on-surface font-bold">{order.zipCode}</span>
                </div>
                <div className="flex justify-between border-t border-surface-container/60 pt-3 text-sm font-extrabold text-on-surface">
                  <span>Paid Total</span>
                  <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Developer Sandbox Simulation Controls */}
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-extrabold text-on-primary-container flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Developer Sandbox Terminal
            </h4>
            <p className="text-xs text-on-primary-container/80 font-medium">
              Inspect different logistic status intervals instantly. Status updates will synchronize with the SQLite database.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => handleSetStatus('Placed')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                status === 'Placed' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white border border-surface-container text-on-surface-variant hover:border-primary'
              }`}
            >
              1. Placed
            </button>
            <button 
              onClick={() => handleSetStatus('Processing')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                status === 'Processing' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white border border-surface-container text-on-surface-variant hover:border-primary'
              }`}
            >
              2. Depot
            </button>
            <button 
              onClick={() => handleSetStatus('In Transit')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                status === 'In Transit' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white border border-surface-container text-on-surface-variant hover:border-primary'
              }`}
            >
              3. Transit
            </button>
            <button 
              onClick={() => handleSetStatus('Delivered')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                status === 'Delivered' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white border border-surface-container text-on-surface-variant hover:border-primary'
              }`}
            >
              4. Delivered
            </button>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  )
}

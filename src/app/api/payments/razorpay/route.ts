import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount } = body

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Valid payment amount is required' }, { status: 400 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    const amountInPaise = Math.round(parseFloat(amount) * 100)

    // Check if authentic Razorpay credentials are set in environment
    if (keyId && keySecret && keyId.trim() !== '' && keySecret.trim() !== '') {
      try {
        const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${Math.random().toString(36).substring(2, 10)}`
          })
        })

        const rzpData = await rzpResponse.json()

        if (!rzpResponse.ok) {
          console.error('Razorpay API creation failure:', rzpData)
          return NextResponse.json({ 
            error: rzpData.error?.description || 'Failed to initialize authentic Razorpay order.' 
          }, { status: rzpResponse.status })
        }

        return NextResponse.json({
          id: rzpData.id,
          amount: rzpData.amount,
          currency: rzpData.currency,
          isSandbox: false,
          keyId: keyId
        })
      } catch (err) {
        console.error('Failed to communicate with Razorpay endpoint:', err)
        return NextResponse.json({ error: 'Connection to payment gateway timed out.' }, { status: 502 })
      }
    }

    // Developer Sandbox fallback when credentials are not configured
    return NextResponse.json({
      id: `rzp_mock_${Math.random().toString(36).substring(2, 15)}`,
      amount: amountInPaise,
      currency: 'INR',
      isSandbox: true,
      keyId: 'rzp_test_sandbox_merchant_key'
    })

  } catch (error) {
    console.error('Razorpay generation API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const trimmedEmail = email.toLowerCase().trim()

    // Query matching user in SQLite database
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    })

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address' }, { status: 400 })
    }

    // Verify provider matches credentials
    if (user.provider !== 'credentials') {
      return NextResponse.json({ 
        error: `This account was registered using Google. Please click "Continue with Google" to sign in.` 
      }, { status: 400 })
    }

    // Match password
    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 400 })
    }

    // Return successful login token data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider
      }
    })

  } catch (error) {
    console.error('Login API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

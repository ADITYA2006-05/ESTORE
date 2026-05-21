import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
    }

    const trimmedEmail = email.toLowerCase().trim()

    // Query if user exists in database
    let user = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    })

    if (user) {
      // If user exists but registered under credentials, let's seamlessly log them in or link it
      if (user.provider !== 'google') {
        user = await prisma.user.update({
          where: { email: trimmedEmail },
          data: { provider: 'google' }
        })
      }
    } else {
      // User doesn't exist - register them dynamically under the Google provider
      user = await prisma.user.create({
        data: {
          email: trimmedEmail,
          name,
          provider: 'google'
        }
      })
    }

    // Return authenticated profile session
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
    console.error('Google Auth Route Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

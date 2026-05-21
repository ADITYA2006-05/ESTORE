import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 0

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const trimmedUsername = username.trim()

    // Retrieve database user with admin role matching email or name
    const user = await prisma.user.findFirst({
      where: {
        role: 'admin',
        OR: [
          { email: trimmedUsername.toLowerCase() },
          { name: trimmedUsername }
        ]
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid administrator credentials.' }, { status: 400 })
    }

    // Verify password match
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid administrator credentials.' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Admin Login API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

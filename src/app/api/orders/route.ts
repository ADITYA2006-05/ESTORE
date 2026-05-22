import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      customerName, 
      customerEmail, 
      shippingAddress, 
      zipCode, 
      totalAmount, 
      items, 
      userId
    } = body

    // Validate inputs
    if (!customerName || !customerEmail || !shippingAddress || !zipCode || !totalAmount || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 })
    }

    // Create the order with nested items and decrement stock transactionally
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify all stock counts first
      for (const item of items) {
        const productId = item.id || item.productId
        if (!productId) continue
        
        const product = await tx.product.findUnique({
          where: { id: productId }
        })
        
        if (!product) {
          throw new Error(`Product "${item.name}" was not found in our database.`)
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} items left in stock.`)
        }
      }

      // 2. Decrement stock counts for all items
      for (const item of items) {
        const productId = item.id || item.productId
        if (!productId) continue

        await tx.product.update({
          where: { id: productId },
          data: {
            stock: {
              decrement: parseInt(item.quantity)
            }
          }
        })
      }

      // 3. Create the order
      return await tx.order.create({
        data: {
          userId: userId || null,
          customerName,
          customerEmail: customerEmail.toLowerCase().trim(),
          shippingAddress,
          zipCode,
          totalAmount: parseFloat(totalAmount),
          status: 'Placed',
          items: {
            create: items.map((item: any) => ({
              productId: item.id || item.productId || 'unknown',
              name: item.name,
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity),
              image: item.image || '',
            })),
          },
        },
        include: {
          items: true,
        },
      })
    })

    return NextResponse.json({ success: true, orderId: order.id, order }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create order:', error)
    const isValidationErr = error.message?.includes('stock') || error.message?.includes('found')
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: isValidationErr ? 400 : 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const filter: any = {}
    if (userId) {
      filter.userId = userId
    }

    const orders = await prisma.order.findMany({
      where: filter,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

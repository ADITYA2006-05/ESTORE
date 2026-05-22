import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Failed to retrieve order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status field is required' }, { status: 400 })
    }

    // Validate status values
    const validStatuses = ['Placed', 'Processing', 'In Transit', 'Delivered']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status value' }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Failed to update order status:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Deleting the order. Since OrderItem has onDelete: Cascade,
    // this will automatically delete all related OrderItems in the database.
    const deletedOrder = await prisma.order.delete({
      where: { id },
    })

    return NextResponse.json(deletedOrder, { status: 200 })
  } catch (error) {
    console.error('Failed to delete order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

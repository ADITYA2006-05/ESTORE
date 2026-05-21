import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deletedProduct = await prisma.product.delete({
      where: { id },
    })
    return NextResponse.json(deletedProduct, { status: 200 })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

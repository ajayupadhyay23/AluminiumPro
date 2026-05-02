import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER'
}

// GET /api/admin/products/[id]
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { reviews: { include: { user: { select: { name: true, email: true } } } } },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('GET /api/admin/products/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/products/[id] — update product fields
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()

    // Build a safe update payload — only update fields provided
    const data: any = {}
    const allowedFields = [
      'name', 'slug', 'sku', 'category', 'subcategory', 'finish', 'description',
      'specs', 'pricePerKg', 'pricePerFoot', 'moq', 'stock', 'images',
      'datasheetUrl', 'tags', 'isActive', 'isFeatured',
    ]
    for (const field of allowedFields) {
      if (field in body) {
        if (field === 'pricePerKg' || field === 'pricePerFoot') {
          data[field] = parseFloat(body[field])
        } else if (field === 'moq' || field === 'stock') {
          data[field] = parseInt(body[field])
        } else {
          data[field] = body[field]
        }
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    console.error('PATCH /api/admin/products/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized — Admins only' }, { status: 403 })
    }

    await prisma.product.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    console.error('DELETE /api/admin/products/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

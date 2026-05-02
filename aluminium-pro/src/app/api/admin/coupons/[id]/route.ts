import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

// PATCH /api/admin/coupons/[id]
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const data: any = {}

    const allowedFields = ['code', 'type', 'value', 'minOrder', 'maxUses', 'isActive', 'expiresAt']
    for (const field of allowedFields) {
      if (field in body) {
        if (field === 'value' || field === 'minOrder') {
          data[field] = parseFloat(body[field])
        } else if (field === 'maxUses') {
          data[field] = body[field] ? parseInt(body[field]) : null
        } else if (field === 'expiresAt') {
          data[field] = body[field] ? new Date(body[field]) : null
        } else if (field === 'code') {
          data[field] = body[field].toUpperCase()
        } else {
          data[field] = body[field]
        }
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 })
    }
    console.error('PATCH /api/admin/coupons/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/coupons/[id]
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.coupon.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true, message: 'Coupon deleted' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 })
    }
    console.error('DELETE /api/admin/coupons/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

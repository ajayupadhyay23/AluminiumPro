import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

// GET /api/admin/coupons
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') === 'true'

    const where: any = {}
    if (activeOnly) where.isActive = true

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, coupons })
  } catch (error) {
    console.error('GET /api/admin/coupons error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/coupons — create a coupon
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { code, type, value, minOrder, maxUses, isActive, expiresAt } = body

    if (!code || !type || value === undefined) {
      return NextResponse.json({ success: false, error: 'code, type, and value are required' }, { status: 400 })
    }

    if (!['PERCENTAGE', 'FLAT'].includes(type)) {
      return NextResponse.json({ success: false, error: 'type must be PERCENTAGE or FLAT' }, { status: 400 })
    }

    if (type === 'PERCENTAGE' && (value <= 0 || value > 100)) {
      return NextResponse.json({ success: false, error: 'Percentage value must be 1–100' }, { status: 400 })
    }

    // Check for duplicate code
    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 409 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        minOrder: parseFloat(minOrder) || 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        isActive: isActive ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json({ success: true, coupon }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/coupons error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

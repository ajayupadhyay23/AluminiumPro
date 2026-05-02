import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderStatusEmail } from '@/lib/email'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER'
}

const VALID_STATUSES = [
  'PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED',
  'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'REFUNDED',
]

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, businessName: true, email: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, sku: true, images: true },
            },
          },
        },
        address: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('GET /api/admin/orders/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { status, note, trackingNumber, courierName, trackingUrl } = body

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Valid: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // Fetch order with user for email
    const existing = await prisma.order.findUnique({
      where: { id: params.id },
      include: { user: { select: { name: true, email: true } } },
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Update order + create status history in transaction
    const updateData: any = { status }
    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (courierName) updateData.courierName = courierName
    if (trackingUrl) updateData.trackingUrl = trackingUrl

    const [order] = await prisma.$transaction([
      prisma.order.update({
        where: { id: params.id },
        data: updateData,
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: params.id,
          status,
          note: note || null,
        },
      }),
    ])

    // Fire order status email (non-blocking)
    if (existing.user?.email) {
      sendOrderStatusEmail(
        existing.user.email,
        existing.user.name,
        existing as any,
        status
      ).catch((err) => console.error('[Email] Failed to send order status email:', err))
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }
    console.error('PATCH /api/admin/orders/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

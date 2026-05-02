import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, primaryImage: true }
            }
          }
        },
        user: {
          select: { email: true, id: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Ensure the order belongs to the logged-in user (or admin)
    if (order.user.email !== session.user.email) {
      // Basic check, assumes no admin bypass here unless session role checked
      return NextResponse.json({ success: false, error: 'Unauthorized access to order' }, { status: 403 })
    }

    return NextResponse.json({ success: true, order })

  } catch (error) {
    console.error('API /user/orders/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

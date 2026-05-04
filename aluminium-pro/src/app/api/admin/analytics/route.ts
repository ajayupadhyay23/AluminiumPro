import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Strict Admin check
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Parallel fetch for dashboard metrics
    const [
      totalUsers,
      totalProducts,
      orders,
      recentOrders
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.findMany({
        select: { total: true, status: true, id: true, createdAt: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, businessName: true } }
        }
      })
    ])

    // Calculate metrics
    const totalRevenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, order) => sum + order.total, 0)

    const pendingOrdersCount = orders.filter(o => o.status === 'PENDING' || o.status === 'PAID').length
    const totalOrdersCount = orders.length

    return NextResponse.json({ 
      success: true, 
      data: {
        totalRevenue,
        totalOrdersCount,
        pendingOrdersCount,
        totalUsers,
        totalProducts,
        recentOrders
      }
    })

  } catch (error) {
    console.error('API /admin/analytics error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

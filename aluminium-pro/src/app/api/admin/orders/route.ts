import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Strict Admin check - EXCLUSIVE ACCESS for aluminiumhouse08@gmail.com
    if (!session || session.user?.email !== 'aluminiumhouse08@gmail.com') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    
    const whereClause: any = {}
    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, businessName: true, email: true }
        },
        _count: {
          select: { items: true }
        }
      }
    })

    return NextResponse.json({ success: true, orders })

  } catch (error) {
    console.error('API /admin/orders error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

// GET /api/admin/users/[id]
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        businessName: true,
        gstNumber: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        _count: { select: { orders: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('GET /api/admin/users/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/users/[id] — update role or isActive
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const data: any = {}

    if ('role' in body) {
      const validRoles = ['CUSTOMER', 'MANAGER', 'ADMIN']
      if (!validRoles.includes(body.role)) {
        return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 })
      }
      // Prevent self-demotion
      if (params.id === session.user?.id && body.role !== 'ADMIN') {
        return NextResponse.json({ success: false, error: 'Cannot change your own role' }, { status: 403 })
      }
      data.role = body.role
    }

    if ('isActive' in body) {
      // Prevent self-deactivation
      if (params.id === session.user?.id && body.isActive === false) {
        return NextResponse.json({ success: false, error: 'Cannot deactivate your own account' }, { status: 403 })
      }
      data.isActive = Boolean(body.isActive)
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    console.error('PATCH /api/admin/users/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

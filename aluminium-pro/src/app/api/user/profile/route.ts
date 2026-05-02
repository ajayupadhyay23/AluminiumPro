import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        businessName: true,
        gstNumber: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error('API GET /user/profile error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, businessName, gstNumber } = body

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        businessName,
        gstNumber
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        businessName: true,
        gstNumber: true,
      }
    })

    return NextResponse.json({ success: true, message: 'Profile updated successfully', user })

  } catch (error) {
    console.error('API PUT /user/profile error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}

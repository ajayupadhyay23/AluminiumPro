import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json()

    if (!email || !token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    const tokenRecord = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        token,
        type: 'password_reset',
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!tokenRecord) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reset token' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
      }),
      prisma.otpToken.update({
        where: { id: tokenRecord.id },
        data: { used: true }
      })
    ])

    return NextResponse.json({ success: true, message: 'Password has been reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

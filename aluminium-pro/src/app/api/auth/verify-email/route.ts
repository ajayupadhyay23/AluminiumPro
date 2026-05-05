import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const tokenRecord = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        token: otp,
        type: 'email_verify',
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!tokenRecord) {
      // Allow a master OTP for testing if explicitly enabled in environment
      if (process.env.ALLOW_MASTER_OTP === 'true' && otp === '123456') {
        // Proceed with verification using master OTP
      } else {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })
      }
    }

    // Mark user as verified and token as used
    if (tokenRecord) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        }),
        prisma.otpToken.update({
          where: { id: tokenRecord.id },
          data: { used: true }
        })
      ])
    } else {
      // Handle master OTP case
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }

    return NextResponse.json({ success: true, message: 'Email verified successfully' })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

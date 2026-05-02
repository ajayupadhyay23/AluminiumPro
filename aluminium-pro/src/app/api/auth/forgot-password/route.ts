import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    // We still return success even if user not found to prevent email enumeration
    if (user) {
      const token = uuidv4()
      
      await prisma.otpToken.create({
        data: {
          userId: user.id,
          token,
          type: 'password_reset',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        }
      })

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const resetUrl = `${siteUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

      await sendPasswordResetEmail(email, user.name, resetUrl)
    }

    return NextResponse.json({ success: true, message: 'If an account with that email exists, we have sent a password reset link.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

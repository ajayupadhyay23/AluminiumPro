import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { sendVerificationEmail } from '@/lib/email'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().optional(),
  gstNumber: z.string().optional()
    .refine(val => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val), 'Invalid GST format')
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, email, phone, password, businessName, gstNumber } = result.data

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered. Please log in.' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user — emailVerified is null until OTP confirmed
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        businessName,
        gstNumber,
        role: 'CUSTOMER',
      }
    })

    // Generate a 6-digit OTP and store it in DB (expires in 15 mins)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await prisma.otpToken.create({
      data: {
        userId: user.id,
        token: otp,
        type: 'email_verify',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    })

    // Log OTP for development/debugging
    console.log(`\n\n=== OTP for ${email}: ${otp} ===\n\n`)

    try {
      // Send OTP email via Resend or Nodemailer
      await sendVerificationEmail(email, name, otp)
    } catch (emailError) {
      console.error('[Register] Email sending failed, but OTP is generated:', emailError)
      // We don't fail the registration here, we allow them to proceed since OTP is logged.
      // But we notify the frontend that email failed.
      return NextResponse.json(
        {
          success: true,
          requiresOtp: true,
          message: 'Account created! Verification code logged to server console (email failed).'
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        requiresOtp: true,
        message: 'Account created! A 6-digit verification code has been sent to your email.'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[Register] Error:', error)

    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

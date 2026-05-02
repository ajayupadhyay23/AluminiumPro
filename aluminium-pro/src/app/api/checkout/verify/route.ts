import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'

    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = shasum.digest('hex')

    if (digest !== razorpay_signature) {
      // Payment verification failed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' }
      })
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }

    // Payment Verified Successfully
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: 'PAID',
        razorpayPaymentId: razorpay_payment_id
      }
    })

    return NextResponse.json({ success: true, message: 'Payment verified successfully' })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

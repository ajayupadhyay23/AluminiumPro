import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Razorpay from 'razorpay'

// Razorpay integration removed for direct UPI payments

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { items, shippingAddress, billingAddress, gstNumber } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // 1. Calculate Total securely on backend
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      // Fetch fresh price from DB to prevent tampering
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, sku: true, pricePerKg: true, pricePerFoot: true, specs: true }
      })

      if (!product) continue

      let itemPrice = 0
      if (item.unit === 'kg') {
        itemPrice = product.pricePerKg
      } else {
        const specs = product.specs as any
        const weightPerFoot = specs?.weightPerFoot || 1
        itemPrice = product.pricePerFoot || (product.pricePerKg * weightPerFoot)
      }

      subtotal += itemPrice * item.quantity

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        productSku: product.sku,
        qty: item.quantity,
        unit: item.unit,
        finishSelected: item.finish || 'SILVER',
        priceAtPurchase: itemPrice,
        subtotal: itemPrice * item.quantity
      })
    }

    const tax = subtotal * 0.18 // 18% GST
    const totalAmount = subtotal + tax

    // Generate Order Number
    const orderNumber = `ALPRO-${Date.now()}`

    // Include gstNumber in snapshot
    const addressSnapshot = {
      ...shippingAddress,
      gstNumber
    }

    // 2. Create Order in Prisma
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: "PLACED",
        total: totalAmount,
        subtotal,
        gstAmount: tax,
        shippingAmount: 0,
        addressSnapshot: addressSnapshot as any,
        couponCode: null,
        items: {
          create: orderItems
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      amount: totalAmount,
      currency: "INR"
    })

  } catch (error: any) {
    console.error('Checkout error details:', error)
    
    // Provide a more descriptive error if possible
    const errorMessage = error?.error?.description || error.message || 'Internal server error'
    
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

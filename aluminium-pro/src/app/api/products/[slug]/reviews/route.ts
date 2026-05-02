import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'You must be logged in to review' }, { status: 401 })
    }

    const { rating, comment } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Valid rating between 1 and 5 is required' }, { status: 400 })
    }

    // Get the product ID
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      select: { id: true }
    })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    // Get the user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: product.id,
        userId: user.id
      }
    })

    if (existingReview) {
      return NextResponse.json({ success: false, error: 'You have already reviewed this product' }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId: product.id,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true, message: 'Review submitted successfully', review })

  } catch (error) {
    console.error('API /reviews error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

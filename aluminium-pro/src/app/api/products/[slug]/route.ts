import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    // Fetch related products (same category, different product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
        isActive: true
      },
      take: 4,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ 
      success: true, 
      product,
      relatedProducts
    })

  } catch (error) {
    console.error('API /products/[slug] error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

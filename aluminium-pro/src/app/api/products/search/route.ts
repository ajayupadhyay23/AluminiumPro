import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { has: query.toLowerCase() } },
        ],
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        finish: true,
        pricePerKg: true,
        images: true,
      },
      take: 10,
    })

    // Safely extract the primary image
    const formattedProducts = products.map((product) => {
      let primaryImage = null;
      if (product.images && Array.isArray(product.images)) {
        const primary = product.images.find((img: any) => img.isPrimary);
        primaryImage = primary?.url || product.images[0]?.url || null;
      }

      return {
        ...product,
        primaryImage
      }
    });

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

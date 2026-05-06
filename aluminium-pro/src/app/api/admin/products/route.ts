import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'

// GET /api/admin/products — list all products (paginated)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category && category !== 'all') {
      where.category = category
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({ success: true, products, total, page, limit })
  } catch (error) {
    console.error('GET /api/admin/products error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/products — create a new product
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const {
      name, slug, sku, category, subcategory, finish, description, specs,
      pricePerKg, pricePerFoot, moq, stock, images, datasheetUrl, tags,
      isActive, isFeatured,
    } = body

    if (!name || !slug || !sku || !category || !pricePerKg || !pricePerFoot) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Check uniqueness
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku }] },
    })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug or SKU already exists' }, { status: 409 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        category,
        subcategory: subcategory || null,
        finish: finish || [],
        description: description || '',
        specs: specs || {},
        pricePerKg: parseFloat(pricePerKg),
        pricePerFoot: parseFloat(pricePerFoot),
        moq: parseInt(moq) || 1,
        stock: parseInt(stock) || 0,
        images: images || [],
        datasheetUrl: datasheetUrl || null,
        tags: tags || [],
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/products error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

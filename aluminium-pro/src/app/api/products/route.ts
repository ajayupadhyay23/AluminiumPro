import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filters
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const finish = searchParams.get('finish')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const alloyGrade = searchParams.get('alloyGrade')
    const inStock = searchParams.get('inStock')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const isAdmin = searchParams.get('isAdmin') === 'true'

    // Build Where Clause
    const whereClause: any = {}
    
    // Only filter by isActive if not requested by Admin
    if (!isAdmin) {
      whereClause.isActive = true
    }
    
    if (featured === 'true') {
      whereClause.isFeatured = true
    }
    
    if (category) {
      whereClause.category = { contains: category, mode: 'insensitive' }
    }

    if (subcategory) {
      whereClause.subcategory = { contains: subcategory, mode: 'insensitive' }
    }
    
    if (finish && finish !== 'all') {
      const finishes = finish.split(',')
      whereClause.finish = { hasSome: finishes.map(f => f.toUpperCase()) }
    }

    if (alloyGrade) {
      const grades = alloyGrade.split(',')
      whereClause.alloyGrade = { in: grades }
    }

    if (minPrice || maxPrice) {
      whereClause.pricePerKg = {}
      if (minPrice) whereClause.pricePerKg.gte = parseFloat(minPrice)
      if (maxPrice) whereClause.pricePerKg.lte = parseFloat(maxPrice)
    }

    if (inStock === 'true') {
      whereClause.stock = { gt: 0 }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } }
      ]
    }

    // Build OrderBy
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { pricePerKg: 'asc' }
    if (sort === 'price_desc') orderBy = { pricePerKg: 'desc' }
    if (sort === 'name_asc') orderBy = { name: 'asc' }
    if (sort === 'name_desc') orderBy = { name: 'desc' }

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause })
    ])

    return NextResponse.json({ 
      success: true, 
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('API /products error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

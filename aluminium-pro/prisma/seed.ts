import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Admin User
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aluminiumpro.in' },
    update: {},
    create: {
      email: 'admin@aluminiumpro.in',
      name: 'Super Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      businessName: 'AluminiumPro HQ',
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // 2. Create Standard User
  const userPassword = await hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo Client',
      passwordHash: userPassword,
      role: 'CUSTOMER',
      businessName: 'M/s Example Fabricators',
      phone: '9876543210'
    },
  })
  console.log(`Created demo client: ${user.email}`)

  // 4. Create Dummy Products
  const products = [
    {
      sku: 'AP-STRUCT-101',
      slug: 'heavy-duty-structural-square-tube-50x50',
      name: 'Heavy Duty Structural Square Tube 50x50',
      description: 'Premium heavy duty structural square tube designed for high load bearing applications. Commonly used in scaffolding, framework, and industrial supports.',
      category: 'Structural Profiles',
      pricePerKg: 285.50,
      pricePerFoot: 85.50,
      stock: 5000,
      moq: 100,
      specs: { height: 50, width: 50, thickness: 2, weightPerMeter: 1.25, alloyGrade: '6061', standardLengths: [12, 14, 16] },
      images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800', isPrimary: true, finish: 'SILVER' }],
      finish: ['SILVER', 'COLOUR'],
      isActive: true,
      isFeatured: true,
    },
    {
      sku: 'AP-DOOR-205',
      slug: 'domal-window-sliding-track',
      name: 'Domal Window Sliding Track',
      description: 'Precision engineered sliding track for Domal series windows. Ensures smooth operation and longevity. Perfect for premium residential and commercial projects.',
      category: 'Door & Window',
      pricePerKg: 310.00,
      pricePerFoot: 65.00,
      stock: 3500,
      moq: 50,
      specs: { weightPerMeter: 0.85, alloyGrade: '6063', standardLengths: [12, 14] },
      images: [{ url: 'https://images.unsplash.com/photo-1541888078426-319ceaa10fbb?auto=format&fit=crop&q=80&w=800', isPrimary: true, finish: 'SILVER' }],
      finish: ['SILVER', 'WOODEN', 'COLOUR'],
      isActive: true,
      isFeatured: true,
    },
    {
      sku: 'AP-ARCH-301',
      slug: 'curtain-wall-mullion-profile',
      name: 'Curtain Wall Mullion Profile',
      description: 'High-strength mullion profile for exterior glass curtain walls. Offers excellent wind load resistance and a sleek architectural finish.',
      category: 'Architectural/Glazing',
      pricePerKg: 345.00,
      pricePerFoot: 120.00,
      stock: 1200,
      moq: 200,
      specs: { weightPerMeter: 2.10, alloyGrade: '6063', standardLengths: [12, 15] },
      images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', isPrimary: true, finish: 'SILVER' }],
      finish: ['SILVER', 'COLOUR'],
      isActive: true,
      isFeatured: false,
    },
    {
      sku: 'AP-DOOR-110',
      slug: 'standard-z-section-partition-profile',
      name: 'Standard Z-Section Partition Profile',
      description: 'Versatile Z-section profile primarily used in office partitions and lightweight structural applications.',
      category: 'Door & Window',
      pricePerKg: 295.00,
      pricePerFoot: 45.00,
      stock: 8000,
      moq: 100,
      specs: { weightPerMeter: 0.60, alloyGrade: '6063', standardLengths: [12] },
      images: [{ url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800', isPrimary: true, finish: 'SILVER' }],
      finish: ['SILVER'],
      isActive: true,
      isFeatured: false,
    }
  ]

  for (const p of products) {
    const createdProduct = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p as any,
    })
    console.log(`Created product: ${createdProduct.sku}`)
  }

  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

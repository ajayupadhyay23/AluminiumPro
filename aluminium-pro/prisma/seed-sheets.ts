import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sheetItems = [
  { name: 'Areca ACP Sheet 3mm', subcategory: 'Areca', thickness: '3mm' },
  { name: 'Areca ACP Sheet 4mm', subcategory: 'Areca', thickness: '4mm' },
  { name: 'Skybond ACP Sheet 3mm', subcategory: 'Skybond', thickness: '3mm' },
  { name: 'Skybond ACP Sheet 4mm', subcategory: 'Skybond', thickness: '4mm' },
  { name: 'Aluminium Plain Sheet 1mm', subcategory: 'Plain', thickness: '1mm' },
  { name: 'Aluminium Chequered Sheet', subcategory: 'Chequered', thickness: '2mm' },
]

async function main() {
  console.log('Removing old channel products from Sheets category...')
  
  // Find products in 'Sheets' category that contain 'Channel' in the name
  const oldSheets = await prisma.product.findMany({
    where: {
      category: 'Sheets',
      OR: [
        { name: { contains: 'Channel' } },
        { name: { contains: 'Profile' } },
        { name: { contains: 'Angle' } }
      ]
    }
  })

  for (const p of oldSheets) {
    await prisma.product.delete({ where: { id: p.id } })
    console.log(`Deleted ${p.name}`)
  }

  console.log('Adding real Sheet products...')

  for (let i = 0; i < sheetItems.length; i++) {
    const item = sheetItems[i]
    const slug = item.name.toLowerCase().replace(/ /g, '-')
    const sku = `AP-SHEET-${2000 + i}`
    
    const productData = {
      sku: sku,
      slug: slug,
      name: item.name,
      description: `Premium quality ${item.name}. Perfect for interior and exterior applications. Standard size 1220x2440mm (4x8 ft).`,
      category: 'Sheets',
      subcategory: item.subcategory,
      pricePerKg: 350.00,
      pricePerFoot: 0,
      stock: 1000,
      moq: 5,
      specs: { thickness: item.thickness, standardLengths: [8, 10, 12], width: '4ft' },
      images: [
        { url: `https://picsum.photos/800/600?random=${500 + i}`, isPrimary: true, finish: 'SILVER' },
        { url: `https://picsum.photos/800/600?random=${550 + i}`, isPrimary: false, finish: 'COLOUR' }
      ],
      finish: ['SILVER', 'COLOUR'],
      isActive: true,
      isFeatured: i % 2 === 0,
    }

    try {
      const createdProduct = await prisma.product.upsert({
        where: { slug: slug },
        update: productData as any,
        create: productData as any,
      })
      console.log(`Added: ${createdProduct.name}`)
    } catch (e) {
      console.error(`Failed to add ${item.name}:`, e)
    }
  }

  console.log('Finished updating sheets.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

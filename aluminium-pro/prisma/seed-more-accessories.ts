import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const accessories = [
  // Screws (Boxes)
  { name: 'SDS Screw 8x1/2"', price: 450, unit: 'box', moq: 5, details: { boxQty: 1000 } },
  { name: 'SDS Screw 8x3/4"', price: 500, unit: 'box', moq: 5, details: { boxQty: 1000 } },
  { name: 'SDS Screw 8x1"', price: 550, unit: 'box', moq: 5, details: { boxQty: 1000 } },
  { name: 'SDS Screw 8x1.5"', price: 600, unit: 'box', moq: 5, details: { boxQty: 500 } },
  { name: 'SDS Screw 8x2"', price: 700, unit: 'box', moq: 5, details: { boxQty: 500 } },
  { name: 'CSK Screw 8x3/4"', price: 480, unit: 'box', moq: 5, details: { boxQty: 1000 } },
  { name: 'CSK Screw 8x1"', price: 520, unit: 'box', moq: 5, details: { boxQty: 1000 } },
  { name: 'CSK Screw 8x1.5"', price: 580, unit: 'box', moq: 5, details: { boxQty: 500 } },
  { name: 'Drywall Screw 1" Black', price: 350, unit: 'box', moq: 10, details: { boxQty: 1000 } },
  { name: 'Drywall Screw 1.5" Black', price: 400, unit: 'box', moq: 10, details: { boxQty: 500 } },

  // Handles & Locks (Pcs)
  { name: 'Pop-up Handle', price: 120, unit: 'pc', moq: 20, details: {} },
  { name: 'Concealed Handle', price: 95, unit: 'pc', moq: 20, details: {} },
  { name: 'D Handle 4"', price: 45, unit: 'pc', moq: 50, details: {} },
  { name: 'D Handle 6"', price: 65, unit: 'pc', moq: 50, details: {} },
  { name: 'Single Point Lock', price: 250, unit: 'pc', moq: 10, details: {} },
  { name: 'Multi-point Lock Premium', price: 450, unit: 'pc', moq: 10, details: {} },
  { name: 'Touch Lock', price: 180, unit: 'pc', moq: 20, details: {} },

  // Hinges & Hardware (Pcs / Pairs)
  { name: '3D Hinge for Casement', price: 220, unit: 'pc', moq: 20, details: {} },
  { name: 'Butt Hinge 4"', price: 85, unit: 'pc', moq: 50, details: {} },
  { name: 'Friction Stay 10"', price: 280, unit: 'pair', moq: 10, details: {} },
  { name: 'Friction Stay 12"', price: 320, unit: 'pair', moq: 10, details: {} },
  { name: 'Adjustable Roller (Single Nylon)', price: 40, unit: 'pc', moq: 100, details: {} },
  { name: 'Adjustable Roller (Double Brass)', price: 120, unit: 'pc', moq: 50, details: {} },
  { name: 'L Cleat / Corner Bracket', price: 15, unit: 'pc', moq: 200, details: {} },
  
  // Gaskets & Weather Strips (Rolls)
  { name: 'EPDM Rubber Gasket 5kg', price: 850, unit: 'roll', moq: 2, details: { weight: '5kg' } },
  { name: 'Wool Pile 5x6mm', price: 350, unit: 'roll', moq: 10, details: { length: '100m' } },
  { name: 'Wool Pile 6x6mm', price: 400, unit: 'roll', moq: 10, details: { length: '100m' } },
]

async function main() {
  console.log('Adding extensive accessories to database...')

  for (let i = 0; i < accessories.length; i++) {
    const item = accessories[i]
    const slug = item.name.toLowerCase().replace(/ /g, '-').replace(/"/g, 'inch').replace(/\//g, '-')
    const sku = `AP-ACCE-${3000 + i}`
    
    // Select image based on unit/type
    let imgPrefix = 400
    if (item.unit === 'box') imgPrefix = 800
    else if (item.unit === 'roll') imgPrefix = 900

    const productData = {
      sku: sku,
      slug: slug,
      name: item.name,
      description: `Premium quality ${item.name}. Ideal for professional aluminium fabrication and installation.`,
      category: 'Accessories',
      subcategory: item.unit === 'box' ? 'Screws' : item.unit === 'roll' ? 'Gaskets & Seals' : 'Hardware',
      pricePerKg: item.price, // We'll use pricePerKg as the base price field
      pricePerFoot: 0,
      stock: 500,
      moq: item.moq,
      specs: { unit: item.unit, ...item.details },
      images: [
        { url: `https://picsum.photos/800/600?random=${imgPrefix + i}`, isPrimary: true, finish: 'SILVER' }
      ],
      finish: [], // Most accessories don't have colour finishes unless specified
      isActive: true,
      isFeatured: i % 5 === 0,
    }

    try {
      const createdProduct = await prisma.product.upsert({
        where: { slug: slug },
        update: productData as any,
        create: productData as any,
      })
      console.log(`Added: ${createdProduct.name} (${item.unit})`)
    } catch (e) {
      console.error(`Failed to add ${item.name}:`, e)
    }
  }

  console.log('Finished updating accessories.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

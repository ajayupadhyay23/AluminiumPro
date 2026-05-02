import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const grills = [
  // Diamond Grills
  { name: 'Diamond Aluminium Grill 4x8 ft (5mm)', price: 1800, unit: 'sheet', moq: 2, details: { size: '4x8 ft', thickness: '5mm', pattern: 'Diamond' } },
  { name: 'Diamond Aluminium Grill 3x7 ft (5mm)', price: 1300, unit: 'sheet', moq: 2, details: { size: '3x7 ft', thickness: '5mm', pattern: 'Diamond' } },
  { name: 'Diamond Aluminium Grill 4x10 ft (5mm)', price: 2300, unit: 'sheet', moq: 2, details: { size: '4x10 ft', thickness: '5mm', pattern: 'Diamond' } },
  { name: 'Diamond Aluminium Grill 4x8 ft (7mm HD)', price: 2500, unit: 'sheet', moq: 2, details: { size: '4x8 ft', thickness: '7mm', pattern: 'Diamond' } },

  // Square Grills
  { name: 'Square Aluminium Grill 4x8 ft (5mm)', price: 1900, unit: 'sheet', moq: 2, details: { size: '4x8 ft', thickness: '5mm', pattern: 'Square' } },
  { name: 'Square Aluminium Grill 3x7 ft (5mm)', price: 1400, unit: 'sheet', moq: 2, details: { size: '3x7 ft', thickness: '5mm', pattern: 'Square' } },
  { name: 'Square Aluminium Grill 4x10 ft (5mm)', price: 2400, unit: 'sheet', moq: 2, details: { size: '4x10 ft', thickness: '5mm', pattern: 'Square' } },

  // Decorative Grills
  { name: 'Decorative Floral Grill 4x8 ft', price: 2800, unit: 'sheet', moq: 1, details: { size: '4x8 ft', thickness: '6mm', pattern: 'Floral' } },
  { name: 'Decorative Hexagon Grill 4x8 ft', price: 2600, unit: 'sheet', moq: 1, details: { size: '4x8 ft', thickness: '5mm', pattern: 'Hexagon' } },
  
  // Ventilation / Mesh
  { name: 'Aluminium Mesh / Mosquito Net 3x100 ft', price: 3500, unit: 'roll', moq: 1, details: { size: '3x100 ft', pattern: 'Mesh' } },
  { name: 'Aluminium Mesh / Mosquito Net 4x100 ft', price: 4600, unit: 'roll', moq: 1, details: { size: '4x100 ft', pattern: 'Mesh' } },
]

const finishes = ['SILVER', 'BROWN', 'BLACK', 'WHITE', 'WOODEN']

async function main() {
  console.log('Adding extensive grills to database...')

  for (let i = 0; i < grills.length; i++) {
    const item = grills[i]
    const slug = item.name.toLowerCase().replace(/ /g, '-').replace(/"/g, 'inch').replace(/\//g, '-').replace(/\(/g, '').replace(/\)/g, '')
    const sku = `AP-GRILL-${4000 + i}`
    
    // Select image based on pattern
    let imgPrefix = 600
    if (item.details.pattern === 'Diamond') imgPrefix = 610
    else if (item.details.pattern === 'Square') imgPrefix = 620
    else if (item.details.pattern === 'Mesh') imgPrefix = 630

    // Assign finishes based on item type
    let itemFinishes = ['SILVER', 'COLOUR']
    if (item.details.pattern === 'Mesh') {
      itemFinishes = ['SILVER', 'COLOUR']
    } else if (item.name.includes('Decorative')) {
      itemFinishes = ['SILVER', 'COLOUR', 'WOODEN']
    }

    const productData = {
      sku: sku,
      slug: slug,
      name: item.name,
      description: `Premium quality ${item.name}. Ideal for safety doors, windows, and ventilation.`,
      category: 'Grills',
      subcategory: item.details.pattern,
      pricePerKg: item.price, // We'll use pricePerKg as the base price field (price per sheet/roll)
      pricePerFoot: 0,
      stock: 200,
      moq: item.moq,
      specs: { unit: item.unit, ...item.details },
      images: [
        { url: `https://picsum.photos/800/600?random=${imgPrefix + i}`, isPrimary: true, finish: 'SILVER' }
      ],
      finish: itemFinishes,
      isActive: true,
      isFeatured: i % 4 === 0,
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

  console.log('Finished updating grills.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

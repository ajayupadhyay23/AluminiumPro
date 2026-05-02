import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const items = [
  // Door & Window Tracks and Frames
  { name: '3 Track Top', category: 'Door & Window', type: 'track' },
  { name: '3 Track Bottom', category: 'Door & Window', type: 'track' },
  { name: '2 Track Top', category: 'Door & Window', type: 'track' },
  { name: '2 Track Bottom', category: 'Door & Window', type: 'track' },
  { name: 'Single Track Top', category: 'Door & Window', type: 'track' },
  { name: 'Single Track Bottom', category: 'Door & Window', type: 'track' },
  { name: 'Side Frame', category: 'Door & Window', type: 'frame' },
  { name: 'Door Top', category: 'Door & Window', type: 'frame' },
  { name: 'Door Bottom', category: 'Door & Window', type: 'frame' },
  
  // Channels
  { name: 'C Channel', category: 'Structural Profiles', type: 'channel' },
  { name: 'G Channel', category: 'Structural Profiles', type: 'channel' },
  { name: 'F Channel', category: 'Structural Profiles', type: 'channel' },
  { name: 'U Channel', category: 'Structural Profiles', type: 'channel' },
  { name: 'H Channel', category: 'Structural Profiles', type: 'channel' },
  
  // Accessories
  { name: 'Handle', category: 'Accessories', type: 'hardware' },
  { name: 'D Handle', category: 'Accessories', type: 'hardware' },
  { name: 'Crescent Lock', category: 'Accessories', type: 'hardware' },
  { name: 'Handle Lock', category: 'Accessories', type: 'hardware' },
  { name: 'Multi-point Lock', category: 'Accessories', type: 'hardware' }
]

const getImageForType = (type: string, index: number) => {
  if (type === 'track') return `https://picsum.photos/800/600?random=${100 + index}`
  if (type === 'frame') return `https://picsum.photos/800/600?random=${200 + index}`
  if (type === 'channel') return `https://picsum.photos/800/600?random=${300 + index}`
  return `https://picsum.photos/800/600?random=${400 + index}` // hardware
}

async function main() {
  console.log('Adding new items to the database...')

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const slug = item.name.toLowerCase().replace(/ /g, '-')
    const sku = `AP-${item.category.substring(0, 4).toUpperCase()}-${1000 + i}`
    
    // Default prices based on category
    const pricePerKg = item.category === 'Accessories' ? 450.00 : 320.00
    const pricePerFoot = item.category === 'Accessories' ? 0 : 85.00
    
    const productData = {
      sku: sku,
      slug: slug,
      name: item.name,
      description: `Premium quality ${item.name} manufactured by Aluminium House. Available in Silver, Colour, and Wooden finishes. Highly durable and perfect for residential and commercial applications.`,
      category: item.category,
      pricePerKg: pricePerKg,
      pricePerFoot: pricePerFoot,
      stock: 5000,
      moq: item.category === 'Accessories' ? 10 : 50,
      specs: { weightPerMeter: 1.2, alloyGrade: '6063', standardLengths: item.category === 'Accessories' ? [] : [12, 14, 16] },
      images: [
        { url: getImageForType(item.type, i), isPrimary: true, finish: 'SILVER' },
        { url: getImageForType(item.type, i + 50), isPrimary: false, finish: 'COLOUR' },
        { url: getImageForType(item.type, i + 100), isPrimary: false, finish: 'WOODEN' }
      ],
      finish: ['SILVER', 'COLOUR', 'WOODEN'],
      isActive: true,
      isFeatured: i % 4 === 0, // Feature every 4th item
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

  console.log('All items added successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

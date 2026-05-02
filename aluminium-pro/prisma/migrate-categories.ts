import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Migrating Categories...')

  const products = await prisma.product.findMany()

  for (const product of products) {
    let newCategory = product.category
    
    // Map Categories
    if (product.category === 'Door & Window') {
      newCategory = 'Material'
    } else if (product.category === 'Structural Profiles') {
      newCategory = 'Sheets'
    } else if (product.category === 'Architectural/Glazing' || product.category === 'Architectural & Glazing') {
      newCategory = 'Grills'
    }

    // Assign Subcategory based on finishes if needed
    // The user requested Silver, Colour, Wooden as subcategories. 
    // We will set the subcategory to the first available finish.
    let newSubcategory = product.subcategory
    if (product.finish && product.finish.length > 0) {
      if (newCategory === 'Material') {
        newSubcategory = product.finish[0] // e.g. 'SILVER', 'COLOUR', 'WOODEN'
      } else if (newCategory === 'Grills') {
        // Grills only have Silver and Colour according to user
        const f = product.finish.find(f => f === 'SILVER' || f === 'COLOUR')
        if (f) newSubcategory = f
      }
    }

    if (newCategory !== product.category || newSubcategory !== product.subcategory) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          category: newCategory,
          subcategory: newSubcategory
        }
      })
      console.log(`Updated ${product.sku} -> Category: ${newCategory}, Subcategory: ${newSubcategory}`)
    }
  }

  console.log('Category migration completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

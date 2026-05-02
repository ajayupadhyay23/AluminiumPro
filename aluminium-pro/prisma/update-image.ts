import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating image for Door Bottom...')

  const product = await prisma.product.findFirst({
    where: { name: 'Door Bottom' }
  })

  if (product) {
    let images: any = product.images
    if (Array.isArray(images) && images.length > 0) {
      images[0].url = 'https://share.google/U4L4t7XYB36dRfDeV'
    } else {
      images = [{ url: 'https://share.google/U4L4t7XYB36dRfDeV', isPrimary: true, finish: 'SILVER' }]
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { images }
    })
    console.log('Successfully updated image for Door Bottom!')
  } else {
    console.log('Door Bottom product not found.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

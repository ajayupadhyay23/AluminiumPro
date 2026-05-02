import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ take: 1 });
  console.log('Product count:', products.length);
  if (products.length > 0) {
    console.log('Sample product:', products[0].slug);
  } else {
    // Create dummy product
    const prod = await prisma.product.create({
      data: {
        name: 'Test Aluminium Profile',
        slug: 'test-aluminium-profile',
        sku: 'TEST-SKU-123',
        category: 'Extrusion',
        description: 'Test description',
        specs: { weightPerFoot: 0.5 },
        pricePerKg: 250,
        pricePerFoot: 150,
        images: [{ url: 'http://example.com/img.jpg' }],
        tags: []
      }
    });
    console.log('Created product:', prod.slug);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

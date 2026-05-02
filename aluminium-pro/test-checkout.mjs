import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'upadhyayajay2235@gmail.com' } });
  const product = await prisma.product.findFirst();

  // We can't easily simulate NextAuth getServerSession via simple HTTP without cookies.
  // Instead, let's just make sure the Prisma logic itself doesn't crash by replicating the logic here.
  
  const orderNumber = `ALPRO-${Date.now()}`
  
  const orderItems = [{
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        qty: 1,
        unit: 'kg',
        finishSelected: 'SILVER',
        priceAtPurchase: 250,
        subtotal: 250
  }];

  const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: "PLACED",
        total: 250 + (250*0.18),
        subtotal: 250,
        gstAmount: 250*0.18,
        shippingAmount: 0,
        addressSnapshot: { city: "Ludhiana" },
        couponCode: null,
        items: {
          create: orderItems
        }
      }
  });
  console.log('Order created successfully:', order.id);
  
  // Cleanup
  await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });
}
main().catch(console.error).finally(() => prisma.$disconnect());

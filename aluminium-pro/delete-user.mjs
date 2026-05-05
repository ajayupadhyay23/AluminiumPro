import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'upadhyayajay2235@gmail.com';
  
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { orders: true }
    });
    
    if (!user) {
      console.log('User not found:', email);
      return;
    }

    const orderIds = user.orders.map(o => o.id);

    // Deep delete order items and status history
    if (orderIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await prisma.orderStatusHistory.deleteMany({ where: { orderId: { in: orderIds } } });
      await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    }

    // Delete other relations
    await prisma.otpToken.deleteMany({ where: { userId: user.id } });
    await prisma.cart.deleteMany({ where: { userId: user.id } });
    await prisma.wishlist.deleteMany({ where: { userId: user.id } });
    
    // For wishlist items if they are not cascaded
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: user.id } });
    if (wishlist) {
      await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } });
      await prisma.wishlist.delete({ where: { id: wishlist.id } });
    }

    await prisma.address.deleteMany({ where: { userId: user.id } });
    await prisma.review.deleteMany({ where: { userId: user.id } });
    await prisma.account.deleteMany({ where: { userId: user.id } });
    await prisma.session.deleteMany({ where: { userId: user.id } });

    const deletedUser = await prisma.user.delete({
      where: { id: user.id }
    });
    console.log('Successfully deleted user and all related records:', deletedUser.email);
  } catch (error) {
    console.error('Error during deletion process:', error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

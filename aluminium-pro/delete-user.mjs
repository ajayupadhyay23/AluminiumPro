import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'upadhyayajay2235@gmail.com' }, include: { orders: true, accounts: true } });
  console.log(user);
}
main().catch(console.error).finally(() => prisma.$disconnect());

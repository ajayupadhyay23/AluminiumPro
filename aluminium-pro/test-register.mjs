import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { execSync } from 'child_process';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'upadhyayajay2235@gmail.com' } });
  if (user) {
    await prisma.otpToken.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Deleted existing user');
  }
  
  execSync(`curl -s -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Ajay Upadhyay", "email": "upadhyayajay2235@gmail.com", "phone": "9044137148", "password": "Password123!"}'`, { stdio: 'inherit' });
  
  console.log('Registration triggered.');
}
main().catch(console.error).finally(() => prisma.$disconnect());

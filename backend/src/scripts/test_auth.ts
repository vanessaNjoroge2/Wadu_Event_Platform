import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing authentication matching for gmail.com users:');
  const users = await prisma.user.findMany({
    where: {
      email: {
        endsWith: 'gmail.com',
      },
    },
  });

  for (const user of users) {
    const matches = await bcrypt.compare('password123', user.password);
    console.log(`Email: "${user.email}" | Role: ${user.role} | Password match for "password123": ${matches}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

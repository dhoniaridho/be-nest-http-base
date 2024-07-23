import { PrismaClient } from '@prisma/client';
import { v7 } from 'uuid';

(async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          id: v7(),
          email: 'wYJ9k@example.com',
          password: '123456',
          username: 'admin',
        },
      }),
    ]);
    console.log('Seed successfully');
  } catch (error) {
    console.log(error);
  }
})();

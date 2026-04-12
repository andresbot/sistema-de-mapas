import { prisma } from './prisma.js';

export const connectDB = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ MySQL connected with Prisma');
  } catch (error) {
    console.error(`❌ MySQL connection error: ${error.message}`);
    throw error;
  }
};

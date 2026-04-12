import 'dotenv/config';
import { connectDB } from '../config/database.js';
import { prisma } from '../config/prisma.js';

const run = async () => {
  try {
    await connectDB();
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('✅ Test query ejecutada correctamente:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en test de conexión Prisma:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

run();

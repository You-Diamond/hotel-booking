// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Используем существующее подключение или создаем новое
export const db = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// В режиме разработки сохраняем экземпляр в глобальный объект
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
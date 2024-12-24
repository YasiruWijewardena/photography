// lib/prisma.js

import { PrismaClient } from '@prisma/client';

let prisma;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // Prevent multiple instances of Prisma Client in development
    if (!global.prisma) {
      global.prisma = new PrismaClient();
      global.prisma.$connect();
    }
    prisma = global.prisma;
  }
}

export default prisma;

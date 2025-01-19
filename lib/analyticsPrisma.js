// lib/analyticsPrisma.js

import { PrismaClient as AnalyticsPrismaClient } from '../prisma/prisma/generated/analytics';

let analyticsDb;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    analyticsDb = new AnalyticsPrismaClient();
  } else {
    if (!global.analyticsDb) {
      global.analyticsDb = new AnalyticsPrismaClient();
      global.analyticsDb.$connect();
    }
    analyticsDb = global.analyticsDb;
  }
}

// If we are in the browser (which generally shouldn't happen for Prisma calls),
// just skip or handle gracefully:
export default analyticsDb;
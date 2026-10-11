const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const config = require('./env');

const connectionString = config.db.connectionString;

// Serverless (Vercel): tiap instance cukup 1 koneksi dan cepat dilepas,
// supaya pooler Supabase tidak kehabisan slot (EMAXCONNSESSION).
const pool = new Pool({
  connectionString,
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;

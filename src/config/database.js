const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../generated/prisma');
const config = require('./env');

const connectionString = config.db.connectionString;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;

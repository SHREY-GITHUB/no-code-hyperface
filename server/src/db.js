// Prisma Client singleton.
// In development nodemon restarts the process on file changes, which would
// create a new PrismaClient on every restart and exhaust the connection pool.
// We attach the instance to the Node.js global to survive hot reloads.

const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
  })
}

const prisma = globalForPrisma.__prisma

module.exports = { prisma }

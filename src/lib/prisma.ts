import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let client: PrismaClient

if (connectionString) {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool as any)
  client = new PrismaClient({ adapter: adapter as any })
} else {
  client = new PrismaClient()
}

export const prisma = globalForPrisma.prisma || client

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

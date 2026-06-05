const { PrismaClient } = require('@prisma/client')
const { PrismaNeon } = require('@prisma/adapter-neon')
const { neonConfig, Pool } = require('@neondatabase/serverless')
const ws = require('ws')

neonConfig.webSocketConstructor = ws

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

module.exports = prisma
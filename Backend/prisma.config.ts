
import 'dotenv/config'
import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,  // ← tambah ini
  },
  migrate: {
    adapter: async () => {
      const { neonConfig, Pool } = await import('@neondatabase/serverless')
      neonConfig.webSocketConstructor = await import('ws').then(m => m.default)
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      return new PrismaNeon(pool)
    },
  },
})
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

import { DATABASE_URL } from './env.js'
import { PrismaClient } from '../generated/prisma/client.js'

const adapter = new PrismaPg({ connectionString: DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export { prisma }

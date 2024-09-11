import express from 'express'
import { router } from './routers/routers.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import type { Express } from 'express'

export const app: Express = express()
app.use(bodyParser.json({ limit: '300mb' }))
app.use(cors())
app.use('/', router)

/* import {redis} from './module/redis.js'
const test = await redis.rpop('queue_checker_whatsapp')
import { redis } from './module/redis.js'
const length = await redis.llen('queue_checker_whatsapp')
console.log("🚀 -> test:", test)  */


console.log('🚀 -> length:', length)
app.listen(3000, () => {
  console.log(`Сервер запущен на  ${3000} порту`)
})

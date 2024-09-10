import express from 'express'
import { router } from './routers/routers.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import type { Express } from 'express'

export const app: Express = express()
app.use(bodyParser.json({ limit: '300mb' }))
app.use(cors())
app.use('/', router)

app.listen(3000, () => {
  console.warn(`Сервер запущен на  ${3000} порту`)
})
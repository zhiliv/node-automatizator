import express from 'express'
import type { Router, Request, Response } from 'express'
import { validatePhone } from './../module/utils.js'
import { redis } from './../module/redis.js'
import moment from 'moment'
import type { Message_queue } from './../../types/Queue.js'

export const PhoneRouter: Router = express.Router()

/* Получение списка запущенных эмуляторов */
PhoneRouter.post('/check-whatsapp', async (req: Request, res: Response) => {
  const body: { phone: number } = req.body

  if (!body?.phone) {
    res.status(500).send('Не указан номер телефона для проверки')
    return
  }

  if (!validatePhone(body.phone)) {
    res.status(500).send('Некорректный номер телефона')
    return
  }

  const obj: Message_queue = {
    phone: body.phone,
    date_add: moment().format('YYYY-MM-DD HH:mm:ss'),
    app: 'whatsapp',
  }

  try {
    await redis.lpush('queue_checker_whatsapp', JSON.stringify(obj))
    res.status(200).send('ok')
  } catch (err: any) {
    res.status(500).send(`Ошибка при добавлении в очередь: ${err}`)
  }
})

import express from 'express'
import fs from 'fs'
import type { Router, Request, Response } from 'express'
import { Message } from '../../types/Message.js'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

export const MessageRouter: Router = express.Router()

/* Получение списка запущенных эмуляторов */
MessageRouter.post('/add', async (req: Request, res: Response) => {
  const message: Message = req.body
  try {
    if (!message) {
      res.status(500).send('Пустой запрос')
      return
    }

    if (!message.text) {
      res.status(500).send('Не передан текста сообщения')
      return
    }

    if (!message.phone) {
      res.status(500).send('Не передан телефона')
      return
    }

    const messagesFileStr: string = fs.readFileSync('./dist/messages.json').toString()
    const messagesFile: Message[] = JSON.parse(messagesFileStr)

    const messages: Message[] = messagesFile
    message.id = uuidv4()
    message.status = false
    message.date_create = moment().format('YYYY-MM-DD HH:mm:ss')
    message.date_send = ''
    messages.push(message)

    await fs.writeFileSync(`./dist/messages.json`, JSON.stringify(messages))
    res.status(200).send('success')
  } catch (err: any) {
    res.status(500).send(`Ошибка при добавлении сообщения в очередь: ${err}`)
  }
})

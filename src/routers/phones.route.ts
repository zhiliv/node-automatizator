import express from 'express'
import fs from 'fs'
import type { Router, Request, Response } from 'express'

export const deviceRouter: Router = express.Router()

/* Получение списка запущенных эмуляторов */
deviceRouter.post('/check-whatsapp', async (req: Request, res: Response) => {
  try {
    const body: {phone: number} = req.body
    if(!body.phone){
      res.status(500).send('Не указан номер телефона для проверки')
      return
    }
    
    
    
  } catch (err: any) {
    res.send(`Ошибка при проверке наличия контакта в whatsapp: ${err}`)
  }
})

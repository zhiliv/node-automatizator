import express from 'express'
import fs from 'fs'
import type { Router, Request, Response } from 'express'

export const deviceRouter: Router = express.Router()

/* Получение списка запущенных эмуляторов */
deviceRouter.get('/list', async (req: Request, res: Response) => {
  try {
    const devices = await fs.readFileSync('../../data/devices.json')
    res.send(devices)
  } catch (err: any) {
    res.send(`Ошибка получения данных о запущенных устройствах: ${err}`)
  }
})

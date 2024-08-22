import express from 'express'
import fs from 'fs'
import type { Router, Request, Response } from 'express'
import { DeviceADB } from '../../types/Devices.js'
import {
  killAppWhatsapp,
  killAppContact,
  getAllContacts,
  addContact,
  runWhatsapp,
  sendEventKey,
  getDevicesADB
} from './../module/adb.js'
import { generateScripts } from './../module/run_py.js'
import { checkContact } from './../module/utils.js'

export const PhoneRouter: Router = express.Router()

/**
** Установка статуса устройству, что оно свободно
* @function setFreeDevice
*/
const setFreeDevice = (devices: DeviceADB[], index: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      devices[index].status = 'free'
      await fs.writeFileSync('./dist/devices.json', JSON.stringify(devices))
      resolve(true)
    } catch (err: any) {
      console.error(`Ошибка присвоения статуса устройству: ${err}`)
      reject(false)
    }
  })
}

/**
** Проверка наличия контакта в whatsapp
* @function checkWhatsapp
* @param {number} phone - номер телефона для проверки
*/
const checkWhatsapp = (phone: number): Promise<string | boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const devicesStr: string = await fs.readFileSync('./dist/devices.json').toString()
      let devices: DeviceADB[] | any = JSON.parse(devicesStr) // Получение списка устройств ADB
      if(!devices.length){
        devices = await getDevicesADB([])
      }
      
      if (devices && !devices?.length) {
        console.warn('Нет устройств ABD')
        reject('Нет устройств ADB')
      }
      
      
      const freeDevices: DeviceADB[] = devices.filter((el: DeviceADB) => el.status === 'free')
      if (!freeDevices.length) {
        reject('Нет свободных устройств')
      }
      
      const device = freeDevices[0] // устройство, которое будет проверять
      const indexDevice: number = devices.findIndex((el: DeviceADB) => el.id === device.id) // Индекс используемого устройства
      devices[indexDevice].status = 'wait' // Устанавливаем статус, что устройство занято
      await fs.writeFileSync('./dist/devices.json', JSON.stringify(devices))
      
      await killAppWhatsapp(device).catch((err) => {
        setFreeDevice(devices, indexDevice)
        //reject(err)
      })
      await killAppContact(device).catch((err) => {
        setFreeDevice(devices, indexDevice)
        //reject(err)
      })
      
      const contacts: any = await getAllContacts(device).catch((err) => {
        setFreeDevice(devices, indexDevice)
        //reject(err)
      })
      if ((contacts && !contacts.length) || contacts.findIndex((el) => +el.number === +phone) === -1) {
        await addContact(device, phone).catch((err) => {
          setFreeDevice(devices, indexDevice)
          //reject(err)
        })
      }
      
      await runWhatsapp(device).catch((err) => {
        setFreeDevice(devices, indexDevice)
        //reject(err)
      })
      await generateScripts('isCreate', device)
      await sendEventKey(String(phone), device) // Поиск номера телефона в списке контактов в whatsapp
      
      const checkPhone: string = await generateScripts('isCheck', device) // генерация скрипта для проверки наличия есть ли данный контакт в whatsapp
      const check = checkContact(checkPhone)
      resolve(check)
    } catch (err: any) {
      reject(`Ошибка при проверка наличия зарегистрированного контакта в whatsapp: ${err}`)
    }
  })
}

/* Получение списка запущенных эмуляторов */
PhoneRouter.post('/check-whatsapp', async (req: Request, res: Response) => {
  const body: { phone: number } = req.body
  
  try {
    console.time('check')
    if (!body?.phone) {
      res.status(500).send('Не указан номер телефона для проверки')
      return 
    }
    
    const check = await checkWhatsapp(body.phone)
    console.timeEnd('check')
    res.status(200).send({ check })
  } catch (err: any) {
    
    res.send(`Ошибка при проверке наличия контакта в whatsapp: ${err}`)
  }
})

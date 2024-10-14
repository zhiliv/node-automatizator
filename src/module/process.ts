import { parentPort, workerData } from 'worker_threads'
import type { Instance } from '../../types/Instances.js'
import { generateScripts } from './run_py.js'


const params = workerData
const instance: Instance = params.instance
//const data: { phone: number } = await getLastProneQueue()

const data: { phone: number } = { phone: 79087868909 }


if (data && data.phone && +data.phone > 79000000000) {

}



process.exit()
//const phone = 79087868908

//await insertCheckWhatsapp(phone, true, params.instance.id)

//await startInstances()

/* 
const devicesStr = await fs.readFileSync('./dist/devices.json').toString()
const devicesFile: DeviceADB[] = JSON.parse(devicesStr)

const messagesStr: string = await fs.readFileSync('./dist/messages.json').toString()
const messages: Message[] = JSON.parse(messagesStr)

const message = await getMessage(messages)

if (!message) {
  parentPort.postMessage('not message')
}

const devices: DeviceADB[] | void = await getDevicesADB(devicesFile).catch((err) => parentPort.postMessage(err))

  console.log('devices333', devices)

if (message) {
  const messageIndex = messages.findIndex((el) => el.id === message.id)

  const devices: DeviceADB[] | void = await getDevicesADB(devicesFile).catch((err) => parentPort.postMessage(err))

  console.log('devices222', devices)

  if (devices && !devices?.length) {
    console.warn('Нет устройств ABD')
    parentPort.postMessage('not device')
  }

  if (devices && devices.length) {
    const freeDevices = devices.filter((el) => el.count <= 2 && el.status === 'free') // Получение устройств с количеством отправленных сообщений менее двух за последние 24 часа
    if (!freeDevices.length) {
      parentPort.postMessage('not free device')
    }

    const device: DeviceADB = freeDevices[0]
    const indexDevice: number = devices.findIndex((el: DeviceADB) => el.id === device.id) // Индекс используемого устройства
    devices[indexDevice].status = 'wait' // Установка статуса активного устройства
    await fs.writeFileSync('./dist/devices.json', JSON.stringify(devices))

    await killAppWhatsapp(device).catch((err) => parentPort.postMessage(err))
    await killAppContact(device).catch((err) => parentPort.postMessage(err))

    const contacts: any = await getAllContacts(device).catch((err) => parentPort.postMessage(err))

    if ((contacts && !contacts.length) || contacts.findIndex((el) => +el.number === +message.phone) === -1) {
      await addContact(device, +message.phone)
    }

    await runWhatsapp(device).catch((err) => parentPort.postMessage(err))
    await generateScripts('isCreate', device)
    await sendEventKey(message.phone, device) // Поиск номера телефона в списке контактов в whatsapp

    const checkPhone: string = await generateScripts('isCheck', device) // генерация скрипта для проверки наличия есть ли данный контакт в whatsapp
    const check = checkElementBool(checkPhone)

    if (check) {
      await tapCoordinates(device, 580, 306) // выбор контакта
      await sendEventKey(message.text, device) // Ввод номера контакта
      await tapCoordinates(device, 838, 1509) // Нажатие кнопки "отправить"
      await killAppWhatsapp(device)
      messages[messageIndex].isWhatsapp = true
      await fs.writeFileSync('./messages.json', JSON.stringify(messages))
    }

    messages[messageIndex].status = true
    messages[messageIndex].isWhatsapp = false
    devices[indexDevice].status = 'free' // Установка статуса активного устройства
    await fs.writeFileSync('./dist/devices.json', JSON.stringify(devices))
    await fs.writeFileSync('./dist/messages.json', JSON.stringify(messages))
  }
}
 */

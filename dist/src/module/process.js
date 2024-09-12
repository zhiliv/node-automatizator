import { parentPort, workerData } from 'worker_threads';
import { killAppWhatsapp, killAppContact, getAllContacts, addContact, runWhatsapp, sendEventKey, connectADB, } from './adb.js';
import { generateScripts } from './run_py.js';
import { checkContact } from './utils.js';
import { getLastProneQueue } from './redis.js';
import { insertCheckWhatsapp } from './pg.js';
const params = workerData;
const data = await getLastProneQueue();
if (data && data.phone && +data.phone > 79000000000) {
    try {
        //await setInstanceDB()
        //const instances: Instance[] = await getInstancesDB()
        //await startInstances(instances[0])
        const connect = await connectADB(params.instance.adb_port).catch();
        if (connect === true) {
            const contacts = await getAllContacts(params.instance).catch((err) => parentPort.postMessage(err));
            if ((contacts && !contacts.length) || contacts.findIndex((el) => +el.number === +data.phone) === -1) {
                await addContact(params.instance, +data.phone);
            }
            try {
                await killAppContact(params.instance).catch();
            }
            catch (err) { }
            try {
                await runWhatsapp(params.instance);
            }
            catch (err) { }
            try {
            }
            catch (err) { }
            await generateScripts('isCreate', params.instance);
            await sendEventKey(String(+data.phone), params.instance);
            const checkPhone = await generateScripts('isCheck', params.instance); // генерация скрипта для проверки наличия есть ли данный контакт в whatsapp
            const check = checkContact(checkPhone);
            await killAppWhatsapp(params.instance).catch();
            console.log('🚀 -> check:', check);
            await insertCheckWhatsapp(+data.phone, check, params.instance.id);
            parentPort.postMessage(true);
        }
    }
    catch (err) {
        console.error(`Произошла ошибка: ${err}`);
        parentPort.postMessage(err);
    }
}
else {
    await insertCheckWhatsapp(+data.phone, false, params.instance.id);
    parentPort.postMessage(true);
}
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
    const check = checkContact(checkPhone)

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

import { workerData } from 'worker_threads';
import { getRandomName } from './utils.js';
const params = workerData;
const instance = params.instance;
//const data: { phone: number } = await getLastProneQueue()
const data = { phone: 79087868909 };
if (data && data.phone && +data.phone > 79000000000) {
    let pyScript = '';
    pyScript += `\nfrom uiautomator2 import Device`;
    pyScript += `\nimport time`;
    pyScript += `\ndevice = Device('${instance.id}')`;
    pyScript += `\ndevice.shell("am start -a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name "${getRandomName()}" -e phone ${data.phone.toString()}")`; // Добавление номера телефона к список контактов
    pyScript += `\nisFirstLaunch = device.xpath("//*[@text='Добавьте аккаунт, чтобы сохранить свои контакты в Google.']").exists`; //Проверка первого запуска
    pyScript += `\nif(isFirstLaunch == True):`;
    pyScript += `\n\tdevice.xpath("//*[@text='ОТМЕНА']").click()`; // Нажатие кнопки "Отменить"`
}
/* if (data && data.phone && +data.phone > 79000000000) {
  try {
    const connect: string = await connectADB(instance)
    if(connect === `127.0.0.1:${instance.adb_port}`){
      const contacts: any = await getAllContacts(instance)
      if ((contacts && !contacts.length) || contacts.findIndex((el) => +el.number === +data.phone) === -1) {
        await addContact(instance, +data.phone)
      }
      await killAppContact(instance)
      
      if(await checkRunWhatsapp(instance) === false){
        await runWhatsapp(instance)
      }
    }
    
    
    //const connect: boolean = await connectADB(params.instance.adb_port)
      const isBlockedChecker: boolean | string = await generateScripts('isBlockedChecker', params.instance) // Проверка блокировки
      const isBlockedBan: boolean | string = await generateScripts('isBlockedBan', params.instance) // Проверка блокировки
      if (!isBlockedChecker && !isBlockedBan) {
        await generateScripts('isCreate', params.instance)
        await sendEventKey(String(+data.phone), params.instance)
        const check: boolean | string = await generateScripts('isCheck', params.instance) // генерация скрипта для проверки наличия есть ли данный контакт в whatsapp
        const checkPhone: boolean = !check
        await insertCheckWhatsapp(+data.phone, checkPhone, params.instance.id)
      }
      else{
        params.instance.isWhatsappBan = true
        await setInstanceDB(params.instance)
        console.error('Устройство заблокировано')
      }
    
  } catch (err) {
    console.error(`Произошла ошибка: ${err}`)
  }
} else {
  await insertCheckWhatsapp(+data.phone, false, params.instance.id)
} */
process.exit();
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

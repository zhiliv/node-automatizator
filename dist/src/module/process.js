/**
 ** Модуль для отправки сообщений
 */
import fs from 'fs';
import { parentPort } from 'worker_threads';
import { getMessage } from './message.js';
import { getDevicesADB, killAppWhatsapp, killAppContact, getAllContacts, addContact, runWhatsapp, sendEventKey, } from './adb.js';
import { generateScripts } from './run_py.js';
import { checkContact } from './utils.js';
import { tapCoordinates } from './adb.js';
const devicesStr = await fs.readFileSync('./dist/devices.json').toString();
const devicesFile = JSON.parse(devicesStr);
const messagesStr = await fs.readFileSync('./dist/messages.json').toString();
const messages = JSON.parse(messagesStr);
const message = await getMessage(messages);
if (!message) {
    parentPort.postMessage('not message');
}
if (message) {
    const messageIndex = messages.findIndex((el) => el.id === message.id);
    const devices = await getDevicesADB(devicesFile).catch((err) => parentPort.postMessage(err));
    console.log('devices', devices);
    if (devices && !devices?.length) {
        console.warn('Нет устройств ABD');
        parentPort.postMessage('not device');
    }
    if (devices && devices.length) {
        const freeDevices = devices.filter((el) => el.count <= 2 && el.status === 'free'); // Получение устройств с количеством отправленных сообщений менее двух за последние 24 часа
        if (!freeDevices.length) {
            parentPort.postMessage('not free device');
        }
        const device = freeDevices[0];
        const indexDevice = devices.findIndex((el) => el.id === device.id); // Индекс используемого устройства
        devices[indexDevice].status = 'wait'; // Установка статуса активного устройства
        await fs.writeFileSync('./dist/devices.json', JSON.stringify(devices));
        await killAppWhatsapp(device).catch((err) => parentPort.postMessage(err));
        await killAppContact(device).catch((err) => parentPort.postMessage(err));
        const contacts = await getAllContacts(device).catch((err) => parentPort.postMessage(err));
        if ((contacts && !contacts.length) || contacts.findIndex((el) => +el.number === +message.phone) === -1) {
            await addContact(device, +message.phone);
        }
        await runWhatsapp(device).catch((err) => parentPort.postMessage(err));
        await generateScripts('isCreate', device);
        await sendEventKey(message.phone, device); // Поиск номера телефона в списке контактов в whatsapp
        const checkPhone = await generateScripts('isCheck', device); // генерация скрипта для проверки наличия есть ли данный контакт в whatsapp
        const check = checkContact(checkPhone);
        if (check) {
            await tapCoordinates(device, 580, 306); // выбор контакта
            await sendEventKey(message.text, device); // Ввод номера контакта
            await tapCoordinates(device, 838, 1509); // Нажатие кнопки "отправить"
            await killAppWhatsapp(device);
            messages[messageIndex].isWhatsapp = true;
            await fs.writeFileSync('./messages.json', JSON.stringify(messages));
        }
        messages[messageIndex].status = true;
        messages[messageIndex].isWhatsapp = false;
        devices[indexDevice].status = 'free'; // Установка статуса активного устройства
        await fs.writeFileSync('./dist/devices.json', JSON.stringify(devices));
        await fs.writeFileSync('./dist/messages.json', JSON.stringify(messages));
    }
}

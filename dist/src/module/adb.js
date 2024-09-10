import { execCLI } from './cmd.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getRandomName, getRandomNumber } from './utils.js';
/**
** Получение списка устройств adb
* @function getDevicesADB
*/
export const getDevicesADB = async (devicesFile) => {
    return new Promise(async (resolve, reject) => {
        try {
            const devicesStr = await execCLI('nox_adb devices');
            console.log("🚀 -> newPromise -> devicesStr:", devicesStr);
            if (devicesStr === 'List of devices attached') {
                resolve([]);
            }
            const devices = devicesStr
                .split('\n')
                .filter((el) => el !== 'List of devices attached\r')
                .map((el) => el.replace('\tdevice\r', ''))
                .filter((el) => el !== '\r' && el !== '');
            devices.forEach((el) => {
                const index = devicesFile.findIndex((dev) => dev.address === el);
                if (index === -1) {
                    devicesFile.push({ address: el, count: 0, last_send: null, id: uuidv4(), status: 'free' });
                }
            });
            devicesFile.forEach((el, ind) => {
                const index = devices.findIndex((dev) => dev === el.address);
                if (index === -1) {
                    devicesFile.splice(ind, 1);
                }
            });
            await fs.writeFileSync('./dist/devices.json', JSON.stringify(devicesFile));
            const result = JSON.parse(await fs.readFileSync('./dist/devices.json').toString());
            console.log("🚀 -> returnnewPromise -> result:", result);
            resolve(result);
        }
        catch (err) {
            reject(`Ошибка при получении списка устройств ADB: ${err}`);
        }
    });
};
/**
** Завершение завершение приложения "WhatsApp"
* @function killAppWhatsapp
* @param {object} device - устройство
*/
export const killAppWhatsapp = async (device) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`nox_adb -s ${device.address} shell am force-stop com.whatsapp`);
                resolve(true);
            }
            catch (err) {
                reject(`Ошибка при завершении приложения Whatsapp: ${err}`);
            }
        }, 500);
    });
};
/**
** Завершение завершение приложения "Контакты"
* @function killAllApp
* @param {object} device - устройство
*/
export const killAppContact = async (device) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`nox_adb -s ${device.address} shell am force-stop com.android.contacts`);
                resolve(true);
            }
            catch (err) {
                reject(`Ошибка при завершении приложения Contacts: ${err}`);
            }
        }, 500);
    });
};
/**
** Получение списка всех контактов
* @function getAllContacts
*/
export const getAllContacts = async (device) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contactsStr = await execCLI(`nox_adb -s ${device.address} shell content query --uri content://contacts/phones/`);
            console.log('contactsStr', contactsStr);
            contactsStr = contactsStr.trim();
            const result = [];
            if (contactsStr === `No result found.`) {
                resolve(result);
                return result;
            }
            const contactsArr = contactsStr
                .split('\n')
                .filter((el) => el !== '')
                .map((el) => el.split(', '));
            contactsArr.forEach((row, ind) => {
                const obj = {};
                obj.row = ind;
                row.forEach((el) => {
                    console.log("🚀 -> row.forEach -> el:", el);
                    el = el.replace('\r', '');
                    const parts = el.split('=');
                    let key = parts[0];
                    let value = parts[1];
                    value = value.replace('\r', '');
                    // Создаем объект с ключом и значением
                    if (value === 'NULL') {
                        value = null;
                    }
                    obj[key] = Number.isInteger(+value) ? +value : value;
                });
                result.push(obj);
            });
            console.log('result', result);
            resolve(result);
        }
        catch (err) {
            reject(`Ошибка при получении списка контактов: ${err}`);
        }
    });
};
/**
** Выполнение клика по координатам
* @function tapCoordinates
* @param {object} device - устройство
* @param {number} x - координата x
* @param {number} y - координата y
*/
export const tapCoordinates = (device, x, y) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`nox_adb -s ${device.address} shell input tap ${x} ${y}`);
                resolve(true);
            }
            catch (err) {
                reject(`Ошибка при тапе по координатам: ${err}`);
            }
        }, 320);
    });
};
/**
** Добавление номера в контакты
* @function addContact
* @param {object} device - устройство
* @param {object} phone - номер телефона
*/
export const addContact = async (device, phone) => {
    /**
    ** Добавление номера в контакты через adb
    * @function insertContact
    */
    const insertContact = async () => {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    await execCLI(`nox_adb -s ${device.address} shell am start -a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name '${getRandomName()}' -e phone ${phone}`);
                    resolve(true);
                }
                catch (err) {
                    reject(`Ошибка при добавлении контакта: ${err}`);
                }
            }, 600);
        });
    };
    return new Promise(async (resolve, reject) => {
        await insertContact().catch(() => reject);
        await tapCoordinates(device, 773, 111).catch(() => reject);
        // await killAppContact(device)
        resolve(true);
    });
};
/**
** Запуск whatsapp
* @function runWhatsapp
*/
export const runWhatsapp = async (device) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`nox_adb -s ${device.address} shell monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1`);
                resolve(true);
            }
            catch (err) {
                reject(`Ошибка при запуске приложения whatsapp: ${err}`);
            }
        }, 1200);
    });
};
/**
** Отправка нажатий кнопок через ADB
* @async
* @function sendEventKey
* @param {string} text - текст сообщения
*/
export const sendEventKey = async (text, device) => {
    /**
    ** Отправка символа через adb
    * @async
    * @function send
    */
    const send = async (char) => {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    await execCLI(`adb -s ${device.address} shell am broadcast -a ADB_INPUT_TEXT --es msg '${char}'`);
                    resolve(true);
                }
                catch (err) {
                    reject(`ошибка при отправке символа: ${err}`);
                }
            }, getRandomNumber(300, 1200));
        });
    };
    text = '' + String(text);
    const textArray = text.split('');
    for await (const char of textArray) {
        await send(char).catch(async () => {
            await send(char);
        });
    }
    return true;
};

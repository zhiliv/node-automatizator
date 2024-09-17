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
            const devicesStr = await execCLI('adb devices');
            if (devicesStr === 'List of devices attached') {
                resolve([]);
            }
            const devices = devicesStr
                .split('\n')
                .filter((el) => el !== 'List of devices attached \r')
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
 * @param {Instance} instance - экземпляр эмулятора
 */
export const killAppWhatsapp = (instance) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell am force-stop com.whatsapp`).catch();
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
 * @param {Instance} instance - экземпляр эмулятора
 */
export const killAppContact = (instance) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell am force-stop com.android.contacts`);
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
 * @param {Instance} instance - экземпляр эмулятора
 */
export const getAllContacts = (instance) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contactsStr = await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell content query --uri content://contacts/phones/`);
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
 * @param {Instance} instance - устройство
 * @param {number} x - координата x
 * @param {number} y - координата y
 */
export const tapCoordinates = (instance, x, y) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell input tap ${x} ${y}`);
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
 * @param {Instance} instance - экземпляр эмулятора
 * @param {object} phone - номер телефона
 */
export const addContact = (instance, phone) => {
    /**
     ** Добавление номера в контакты через adb
     * @function insertContact
     */
    const insertContact = () => {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell am start -a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name '${getRandomName()}' -e phone ${phone}`).catch();
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
        await tapCoordinates(instance, 773, 111).catch(() => reject);
        // await killAppContact(device)
        resolve(true);
    });
};
/**
 ** Запуск whatsapp
 * @function runWhatsapp
 * @param {Instance} instance - экземпляр эмулятора
 */
export const runWhatsapp = (instance) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1`).catch();
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
 * @param {Instance} instance - экземпляр эмулятор
 */
export const sendEventKey = async (text, instance) => {
    /**
     ** Отправка символа через adb
     * @async
     * @function send
     */
    const send = async (char) => {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    //await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell ime enable com.android.adbkeyboard/.AdbIME`)
                    await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell am broadcast -a ADB_INPUT_TEXT --es msg '${char}'`);
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
/**
 ** Завершение ранее запущенных модулей adb
 * @function killADB
 */
export const killADB = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const string = await execCLI('adb kill-server');
            resolve(true);
        }
        catch (err) {
            if (err !== '* server not running *')
                console.error(`Ошибка при завершении процесса adb: ${err}`);
            reject(false);
        }
    });
};
/**
 ** Подключение эмулятора по adb
 * @function connectADB
 * @param {number} port - порт эмулятора
 * @param {number} count - кол-во попыток подключения
 */
export const connectADB = async (port, count = 0) => {
    return new Promise(async (resolve, reject) => {
        try {
            await execCLI(`adb disconnect 127.0.0.1:${port}`).catch();
        }
        catch (err) { }
        try {
            const result = (await execCLI(`adb connect 127.0.0.1:${port}`)).trim();
            if (result === `connected to 127.0.0.1:${port}`) {
                console.log(`Эмулятор успешно подключен: 127.0.0.1:${port}`);
                resolve(true);
                return;
            }
            else if (result === `already connected to 127.0.0.1:${port}`) {
                if (count < 120) {
                    setTimeout(async () => {
                        count++;
                        console.log('🚀 -> setTimeout -> count:', count);
                        await connectADB(port, count);
                        resolve(false);
                        return;
                    }, 500);
                }
            }
            else {
                resolve(false);
                return;
            }
        }
        catch (err) {
            reject(err);
        }
    });
};
/**
 ** Удаление всех контактов
 * @function remoteAllContats
 */
export const remoteAllContats = async (instance) => {
    return new Promise(async (resolve, reject) => {
        try {
            await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell pm clear com.android.providers.contacts`);
            resolve(true);
        }
        catch (err) {
            reject(false);
        }
    });
};
/**
 ** Проверка запущенного приложения Whatsapp
 * @function checkRunWhatsapp
 */
export const checkRunWhatsapp = async (instance) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await execCLI(`adb -s 127.0.0.1:${instance.adb_port} shell pgrep com.whatsapp`);
            if (result === '')
                resolve(false);
            else
                resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};

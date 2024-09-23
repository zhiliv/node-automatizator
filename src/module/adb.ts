import { execCLI } from './cmd.js'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { getRandomName, getRandomNumber } from './utils.js'
import { Instance } from '../../types/Instances.js'
import { Adb_device } from './../../types/ADB.js'
import adb from 'adbkit'

export const clientADB = adb.createClient()

/** 
** Подключение устройства по adb
* @async
* @function connect
* @param {Instance} instance - экземпляр эмулятора
* @result - 127.0.0.1:adb_port
*/
export const connectADB = async (instance: Instance): Promise<string> => {
  return new Promise(async(resolve, reject) => {
    try{
      const result: string = await clientADB.connect('127.0.0.1', instance.adb_port)      
      resolve(result)
    }
    catch(err: any){
      reject(err.toString())
    }
  })
}

/**  
** Отключение от устройства adb
* @async
* @function disconnect
* @param {Instance} instance - экземпляр эмулятора
*/
export const disconnect = async (instance: Instance): Promise<String> => {
  return new Promise(async(resolve, reject) => {
    try{
      const result: String = await clientADB.disconnect('127.0.0.1', instance.adb_port)
      resolve(result)
    }
    catch(err: any){
      reject(err.toString())
    }
  })
}


/**
 ** Получение списка устройств adb
 * @function getDevicesADB
 */
export const getDevicesADB = async (): Promise<Adb_device[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result: Adb_device[] = await clientADB.listDevices()
      resolve(result)
    } catch (err: any) {
      reject(err.toString())
    }
  })
}

/**
 ** Завершение завершение приложения "WhatsApp"
 * @function killAppWhatsapp
 * @param {Instance} instance - экземпляр эмулятора
 */
export const killAppWhatsapp = (instance: Instance): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try{
      await clientADB
        .shell(`127.0.0.1:${instance.adb_port}`, 'am force-stop com.whatsapp')
        .then(adb.util.readAll)
        .then((output:any) =>  {
          resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
        })  
      }
      catch(err){
        reject(err.toString())
      }
    }, 500)
  })
}

/**
 ** Завершение завершение приложения "Контакты"
 * @function killAllApp
 * @param {Instance} instance - экземпляр эмулятора
 */
export const killAppContact = (instance: Instance): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        await clientADB
          .shell(`127.0.0.1:${instance.adb_port}`, 'am force-stop com.android.contacts')
          .then(adb.util.readAll)
          .then((output: any) => {
            resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
          })
      } catch (err) {
        reject(err.toString())
      }
    }, 500)
  })
}

/**
 ** Получение списка всех контактов
 * @function getAllContacts
 * @param {Instance} instance - экземпляр эмулятора
 */
export const getAllContacts = async(instance: Instance): Promise<any> => {
  return new Promise(async (resolve, reject) => {
  try {
    await clientADB
      .shell(`127.0.0.1:${instance.adb_port}`, 'content query --uri content://contacts/phones/')
      .then(adb.util.readAll)
      .then((output: any) => {
        const contactsStr: string = output.toString().trim()
        const result: string[] = []

        if (contactsStr === `No result found.`) {
          resolve(result)
          return result
        }

        const contactsArr: string[][] = contactsStr
          .split('\n')
          .filter((el) => el !== '')
          .map((el) => el.split(', '))
        contactsArr.forEach((row, ind) => {
          const obj: any = {}
          obj.row = ind
          row.forEach((el: any) => {
            el = el.replace('\r', '')
            const parts = el.split('=')

            let key: string = parts[0]
            let value: string = parts[1]
            value = value.replace('\r', '')
            // Создаем объект с ключом и значением
            if (value === 'NULL') {
              value = null
            }
            obj[key] = Number.isInteger(+value) ? +value : value
          })
          result.push(obj)
        })
        
        
        resolve(result)
      })
  } catch (err) {
    reject(err.toString())
  }  
    
    
  })
}

/**
 ** Выполнение клика по координатам
 * @function tapCoordinates
 * @param {Instance} instance - устройство
 * @param {number} x - координата x
 * @param {number} y - координата y
 */
export const tapCoordinates = (instance: Instance, x: number, y: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        await clientADB
          .shell(`127.0.0.1:${instance.adb_port}`, `input tap ${x} ${y}`)
          .then(adb.util.readAll)
          .then((output: any) => {
            resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
          })
      } catch (err) {
        reject(err.toString())
      }
    }, 320)
  })
}

export const startAppContact = (instance: Instance): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await clientADB
        .shell(`127.0.0.1:${instance.adb_port}`, 'monkey -p com.android.contacts -c android.intent.category.LAUNCHER 1')
        .then(adb.util.readAll)
        .then((output: any) => {
          resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
        })
    } catch (err) {
      reject(err.toString())
    }
  })
}

/**
 ** Добавление номера в контакты
 * @function addContact
 * @param {Instance} instance - экземпляр эмулятора
 * @param {object} phone - номер телефона
 */
export const addContact = (instance: Instance, phone: number): Promise<string> => {

  
  /**
   ** Добавление номера в контакты через adb
   * @function insertContact
   */
  const insertContact = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          await clientADB
            .shell(`127.0.0.1:${instance.adb_port}`, `am start -a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name '${getRandomName()}' -e phone ${phone}`)
            .then(adb.util.readAll)
            .then((output: any) => {
              resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
            })
        } catch (err) {
          reject(err.toString())
        }
      }, 600)
    })
  }

  return new Promise(async (resolve, reject) => {
    await insertContact().catch(() => reject)
    await tapCoordinates(instance, 773, 111).catch(() => reject)
    // await killAppContact(device)
    resolve('true')
  }) 
  
}

/**
 ** Запуск whatsapp
 * @function runWhatsapp
 * @param {Instance} instance - экземпляр эмулятора
 */
export const runWhatsapp = (instance: Instance): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      await clientADB
        .shell(`127.0.0.1:${instance.adb_port}`, `monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1`)
        .then(adb.util.readAll)
        .then((output: any) => {
          resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
        })
        .catch((err) => reject(err.toString()))
    }, 1200)
  })
}

/**
 ** Отправка нажатий кнопок через ADB
 * @async
 * @function sendEventKey
 * @param {string} text - текст сообщения
 * @param {Instance} instance - экземпляр эмулятор
 */
export const sendEventKey = async (text: string, instance: Instance): Promise<boolean> => {
  /**
   ** Отправка символа через adb
   * @async
   * @function send
   */
  const send = async (char: string) => {
    return new Promise(async (resolve, reject) => {
      setTimeout(
        async () => {
          await clientADB
            .shell(`127.0.0.1:${instance.adb_port}`, `am broadcast -a ADB_INPUT_TEXT --es msg '${char}'`)
            .then(adb.util.readAll)
            .then((output: any) => {
              resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
            })
            .catch(err => reject(err.toString()))
        },
        getRandomNumber(300, 1200),
      )
    })
  }

  text = '' + String(text)
  const textArray: string[] = text.split('')

  for await (const char of textArray) {
    await send(char).catch(async () => {
      await send(char)
    })
  }
  return true
}

/**
 ** Удаление всех контактов
 * @function remoteAllContats
 */
export const remoteAllContats = async (instance: Instance) => {
  return new Promise(async (resolve, reject) => {
      await clientADB
        .shell(`127.0.0.1:${instance.adb_port}`, `pm clear com.android.providers.contacts`)
        .then(adb.util.readAll)
        .then((output: any) => {
          resolve(`127.0.0.1:${instance.adb_port} ${output.toString().trim()}`)
        })
        .catch((err) => reject(err.toString()))
  })
}

/**
 ** Проверка запущенного приложения Whatsapp
 * @function checkRunWhatsapp
 */
export const checkRunWhatsapp = async (instance: Instance): Promise<string | boolean> => {
  return new Promise(async (resolve, reject) => {
    await clientADB
      .shell(`127.0.0.1:${instance.adb_port}`, `pgrep com.whatsapp`)
      .then(adb.util.readAll)
      .then((output: any) => {
        const result: string = output.toString().trim()
        if(Number.isInteger(+result)){
          resolve(true)  
        }
        else 
          resolve(false)
        
      })
      .catch((err) => reject(err.toString()))
  })
}

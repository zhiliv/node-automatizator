/******************************
 ** Работа с bluestack         *
 *******************************/
import fs from 'fs'
import { redis } from './redis.js'
import { execCLI } from './cmd.js'
import chalk from 'chalk'
import type { Instance } from './../../types/Instances.js'

const pathBluestackConf = 'C:/ProgramData/BlueStacks_nxt/'
const configString = await fs.readFileSync(`${pathBluestackConf}bluestacks.conf`).toString()

/**
 ** Преобразование текстовой конфигурации в json
 * @function textToJson
 */
const textToJson = (text): Object => {
  const lines: string[] = text.trim().split('\n') // Разделяем текст на строки
  const jsonObject: object = {} // Создаем начальную структуру объекта

  lines.forEach((line) => {
    // Используем регулярное выражение для извлечения ключа и значения
    const match: string[] = line.match(/bst\.(.+?)="(.+?)"/)
    if (match) {
      const key: string = match[1] // Ключ
      const value: string = match[2] // Значение
      const keys: string[] = key.split('.') // Разделяем ключи по точке

      // Создаем вложенные объекты по ключам
      let current: object = jsonObject
      keys.forEach((k: string, index: number) => {
        if (!current[k]) {
          current[k] = index === keys.length - 1 ? value : {}
        }
        current = current[k]
      })
    }
  })

  return jsonObject // Возвращаем итоговый объект
}

export const configJSON: any = textToJson(configString)

/**
 ** Получение эмуляторов
 * @function getInstance
 */
export const getInstance = (): Instance[] => {
  const instances: Instance[] = []
  for (let key in configJSON.instance) {
    const instance: Instance = {
      id: key,
      display_name: configJSON.instance[key].display_name,
      adb_port: configJSON.instance[key].adb_port,
      isActive: false,
    }
    instances.push(instance)
  }
  return instances
}

/**
 ** Получение списка экземпляров из БД
 * @async
 * @function getInstancesDB
 */
export const getInstancesDB = async (): Promise<Instance[]> => {
  try {
    const instancesStr: string = await redis.get('instances')
    const instances: Instance[] = JSON.parse(instancesStr)
    return instances
  } catch (err) {
    console.error(`Ошибка при получении списка эмуляторов из БД: ${err}`)
  }
  return []
}

/**
 ** Получение экземпляров эмулятора и запись в БД
 * @function setInstanceDB
 */
export const setInstanceDB = async (instanceControl?: Instance): Promise<void> => {
  const instances: Instance[] = getInstance()
  const instancesDB: Instance[] = await getInstancesDB()
  instances.forEach((instance: Instance) => {
    if (instancesDB.findIndex((instanceDB: Instance) => instanceDB.id === instance.id) === -1) {
      instancesDB.push(instance)
    }
  })
  
  if (instanceControl) {
    const index: number = instances.findIndex((instance: Instance) => instance.id === instanceControl.id)
    console.log("🚀 -> setInstanceDB -> index:", index)
    if(index !== -1){
      instances[index].isWhatsappBan = instanceControl.isWhatsappBan
      instances[index].isTelegramBan = instanceControl.isTelegramBan
    }
  }
  await redis.set('instances', JSON.stringify(instances))
}

/**
 ** Получение списка неактивных эмуляторов
 * @async
 * @function getNotActiveInstances
 */
export const getNotActiveInstances = async (): Promise<Instance[]> => {
  const instances: Instance[] = await getInstancesDB()
  return instances.filter((instance) => !instance.isActive)
}

/**
 ** Запуск экземпляра эмулятора
 * @function startInstance
 * @param {string} instance - ID экземпляра
 * @param {Instances} instances - Список экземпляров
 */
export const startInstances = async (instance: Instance): Promise<void> => {
  try {
    await execCLI(`"C:/Program Files/BlueStacks_nxt/HD-Player.exe" --instance ${instance.id}`).catch()
  } catch (err) {
  }
}

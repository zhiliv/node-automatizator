import { UUID } from './UUID.js'

/**
 ** Интерфейс для работы с очередями adb
 * @interface ADB_queue
 * @param {number} adb_port - порт устройства adb
 * @param {string} id - идентификатор устройства
 * @param {string} type - тип очереди
 * @param {string} script - скрипт для выполнения
 */
export interface ADB_queue {
  adb_port: number
  id: string
  type: 'py_script' | 'adb'
  script: string
}

/** 
** Интерфейс для работы с очередями adb
*/
export interface Message_queue {
  phone: number
  date_add: string
  app: 'whatsapp' | 'telegram'
}

import { UUID } from './UUID.js'

/**
** Экземпляр устройства
* @interface Device
* @property {string} id - идентификатор устройства
* @property {boolean} status - статус устройства
* @property {string} title - название устройства
*/
export interface Device {
  id: Number
  name: string
  status: boolean
  title: string
}


type statusDevice = 'wait' | 'free'

/** 
** Интерфейс описания устройств ADB
* @interface DeviceADB
* @property {string} address - адрес устройства
* @property {number} count - количество отправленных сообщений за час
* @property {number} last_send - время последней отправки сообщения за час
* @property {UUID} id - идентификатор устройства
* @property {boolean} status - статус устройства
*/
export interface DeviceADB {
  address: string
  count: number
  last_send: null | null
  id: UUID
  status: statusDevice
}

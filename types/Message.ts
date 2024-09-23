import { UUID } from './UUID.js'

/**
* @interface Message
* @member {UUID} id - Идентификатор сообщения
* @member {string} text - Сообщение для отправки
* @member {string} phone - Номер телефона
* @member {boolean} status - Статус отправки сообщения
* @member {TimeStamp} date_create - Дата создания сообщения
* @member {TimeStamp} date_send - Дата отправки сообщения
* @member {string} app - Идентификатор приложения
*/
export interface Message {
  id?: UUID | string
  text: string
  phone: string
  status?: boolean
  date_create: string
  date_send: string
  app: 'whatsapp' | 'telegram'
}

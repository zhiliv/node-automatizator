/**
 ** Интерфейс эмулятора
 * @interface Instance
 * @property {string} id - Идентификатор эмулятора
 * @member {string} display_name - Имя эмулятора
 * @member {number} adb_port - Порт ADB
 * @member {boolean} isActive - Флаг активности эмулятора
 * @member {boolean} whatsapp - Флаг WhatsApp
 * @member {boolean} telegram - Флаг Telegram
 * @member {boolean} isWhatsappBan - Флаг бана WhatsApp
 * @member {boolean} isTelegramBan - Флаг бана Telegram
 */
export interface Instance {
  id: string
  display_name: string
  adb_port: number
  isActive: boolean
  whatsapp?: boolean
  telegram?: boolean
  isWhatsappBan?: boolean
  isTelegramBan?: boolean
}

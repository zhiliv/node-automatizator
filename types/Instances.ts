/**
 ** Интерфейс эмулятора
 * @interface Instance
 * @property {string} id - Идентификатор эмулятора
 * @member {string} display_name - Имя эмулятора
 * @member {number} adb_port - Порт ADB
 * @member {boolean} isActive - Флаг активности эмулятора
 */
export interface Instance {
  id: string
  display_name: string
  adb_port: number
  isActive: boolean
}

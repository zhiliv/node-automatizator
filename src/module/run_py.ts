import type { DeviceADB } from '../../types/Devices.js'
import { Instance } from '../../types/Instances.js'
import type { Message } from '../../types/Message.js'
import { getRandomNumberScript, getRandom, checkElementBool } from './utils.js'
import fs from 'fs'
import { PythonShell } from 'python-shell'

/**
** Генерация скриптов для эмулятора
* @function generateScripts
* @param {isCreate | isCheck} options - вариант выбора скрипта
*/
export const generateScripts = async (
  options: 'isCreate' | 'isCheck' | 'isBlockedChecker' | 'isBlockedBan',
  instance: Instance,
): Promise<string | boolean> => {
  const scriptName = getRandom()

  /**
   ** Удаление файла скрипта
   * @function removeScript
   * @param {string} fileName - имя файла скрипта
   */
  const removeScript = async (fileName: string): Promise<void> => {
    try {
      await fs.unlinkSync(`./py_scripts/${fileName}.py`)
    } catch (err) {}
  }

  // script += `\ndevice.press.home()`
  //script += '\ndevice.press.back()'
  return new Promise(async (resolve, reject) => {
    let script: string = 'from uiautomator2 import Device'
    script += '\nimport time'
    script += `\ndevice = Device('127.0.0.1:${instance.adb_port}')`

    /* Скрипт для выбора поля ввода контакта */
    if (options === 'isCreate') {
      script += `\ntime.sleep(${getRandomNumberScript(1000, 2000)})` // Установка задержки
      script += '\ndevice.click(0.877, 0.844)' // Нажатие "отправить сообщение"
      script += `\ntime.sleep(${getRandomNumberScript(1000, 2000)})` // Установка задержки
      script += '\ndevice.click(0.865, 0.059)' // Нажатие "Лупа"
      script += `\ntime.sleep(${getRandomNumberScript(1000, 2000)})` // Установка задержки
    }

    if (options === 'isCheck') {
      script += `\ntime.sleep(${getRandomNumberScript(1000, 2000)})` // Установка задержки
      script += `\nprint(device.xpath("//android.widget.Button[@text='ПРИГЛАСИТЬ']").exists)`
    }

    if (options === 'isBlockedChecker') {
      script += `\ntime.sleep(${getRandomNumberScript(1000, 2000)})` // Установка задержки
      script += `\nprint(device.xpath("//android.widget.TextView[@text='Этот аккаунт больше не может использовать WhatsApp']").exists)`
    }

    if (options === 'isBlockedBan') {
      script += `\ntime.sleep(${getRandomNumberScript(1000, 2000)})` // Установка задержки
      // script
      script += `\nprint(device.xpath("//android.widget.TextView[@text='Этот аккаунт больше не может использовать WhatsApp в связи с рассылкой спама']").exists)`
    }
    
    setTimeout(async () => {
      try {
        await fs.writeFileSync(`./py_scripts/${scriptName}.py`, script)
        const res: string = String(await PythonShell.run(`py_scripts/${scriptName}.py`, null))
        // await fs.unlinkSync(`${scriptName}.py`)
        await removeScript(scriptName)

        if (options === 'isBlockedChecker' || options === 'isCheck') {
          resolve(checkElementBool(res))
        } else {
          resolve(res)
        }
        resolve(res)
      } catch (err: any) {
        await removeScript(scriptName)
        reject(`Ошибка при выполнении скрипта python: ${err}`)
      }
    }, 80)
  })
}

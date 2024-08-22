import type { DeviceADB } from '../../types/Devices.js'
import type { Message } from '../../types/Message.js'
import { getRandomNumberScript, getRandom } from './utils.js'
import fs from 'fs'
import { PythonShell } from 'python-shell'

/**
** Генерация скриптов для эмулятора
* @function generateScripts
*/
export const generateScripts = async (options: string, device: DeviceADB): Promise<string> => {
  const scriptName = getRandom()
  
  /** 
  ** Удаление файла скрипта
  * @function removeScript
  * @param {string} fileName - имя файла скрипта
  */
  const removeScript = async (fileName: string): Promise<void> => {
    try {
      await fs.unlinkSync(`${fileName}.py`)
    } catch (err) {
      console.log(err)
    }
  }
  
  
  
  // script += `\ndevice.press.home()`
  //script += '\ndevice.press.back()'
  return new Promise(async (resolve, reject) => {
    let script: string = 'from uiautomator2 import Device'
    script += '\nimport time'
    script += `\ndevice = Device('${device.address}')`
    
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
      // script
      script += `\nprint(device.xpath("//android.widget.ListView/android.widget.RelativeLayout[@index='4']/android.widget.LinearLayout[@index='2']/android.widget.Button[@index='0']").exists)`
    }
    
    setTimeout(async () => {
      
      try {
        await fs.writeFileSync(`./${scriptName}.py`, script)
        const res: string = String(await PythonShell.run(`${scriptName}.py`, null))
        // await fs.unlinkSync(`${scriptName}.py`)
        await removeScript(scriptName)
        resolve(res)
      } catch (err: any) {
        //await removeScript(scriptName)
        reject(`Ошибка при выполнении скрипта python: ${err}`)
      }
    }, 80)
  })
}

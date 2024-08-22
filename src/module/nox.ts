import { execCLI } from './cmd.js'
import type { Device } from '../../types/Devices.js'

/**
 ** Получение всех эмуляторов
 * @function getDevices
 */
export const getDevices = async (): Promise<Device[]> => {
  const result: Device[] = [] // Список устройств
  try {
    const listStr: string = await execCLI('NoxConsole.exe list') // Получение списка устройств LDplayer
    const arrStr: string[] = listStr
      .split('\n')
      .filter(
        (el: string) => el,
      ) /*  [ '0,automatizator,0,0,0,-1,-1,1080,1920,480\r', '1,automatizator-1,0,0,0,-1,-1,1080,1920,480\r' ]*/

    arrStr.map((el: string) => {
      const arrElDevice: string[] = el.split(',')
      const obj: Device = {
        id: +arrElDevice[0],
        name: arrElDevice[1],
        title: arrElDevice[2],
        status: +arrElDevice[3] === 0 ? false : true,
      }
      result.push(obj)
    })
  } catch (err) {
    console.error(`Ошибка при получении списка устройств LDplayer: ${err}`)
  }
  return result
}

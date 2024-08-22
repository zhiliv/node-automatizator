import fs from 'fs'

const namesStr: string = fs.readFileSync('./names.json').toString() // файл с именами
const names: string[] = JSON.parse(namesStr.toString())

/**
 ** Получение случайного имени
 * @function getRandomName
 */
export const getRandomName = (): string => {
  const index: number = Math.floor(Math.random() * 155)
  return names[index]
}

/**
 ** Генерация случайного числа
 * @function getRandomNumberScript
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 */
export const getRandomNumberScript = (min: number, max: number): number | string => {
  const number: number = Math.floor(Math.random() * (max - min + 1)) + min
  if (number > 1000) {
    return number / 1000
  } else {
    return +`0.${number}`
  }
}

/**
 ** Генерация случайного числа для таймаутов
 * @function getRandomNumber
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 */
export const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

/** 
** Проверка существования контакта в whatsapp
* @function checkContact
* @param {string} resultCheck - результат проверки на устройстве
*/
export const checkContact =  (resultCheck: string): boolean => {
  if (!resultCheck.length) return true
  return resultCheck.indexOf('True') !== -1 ? false : true
}
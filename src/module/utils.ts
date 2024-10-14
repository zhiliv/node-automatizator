import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
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
 * @function checkElementBool
 * @param {string} resultCheck - результат проверки на устройстве
 */
export const checkElementBool = (resultCheck: string): boolean => {
  if (!resultCheck.length) return true
  return resultCheck.indexOf('True') !== -1 ? true : false
}

/**
 ** Получение случайного числа
 * @function getRandom
 */
export const getRandom = (): string => {
  const num: number = Math.floor(Math.random() * 99999)
  return String(num)
}

/**
 ** Валидация номера телефона
 * @function validatePhone
 * @param {number} phoneNumber - номер телефона
 */
export const validatePhone = (phoneNumber: number) => {
  const phonePattern = /^7\d{10}$/
  const phone = String(phoneNumber)
  return phonePattern.test(phone) && +phone > 79000000000
}

export const isDev = process.env?.npm_lifecycle_script?.indexOf('isDev=true') < 0 ? false : true // признак запуска проекта в режиме разработки

/*
 ** Запуск скрита
 * @function runScript
 */
export const runScript = (script: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let result: string = '' // Результат ответа
    const child: ChildProcessWithoutNullStreams = spawn('python')

    child.stdin.cork()
    child.stdin.write(script)
    child.stdin.end()

    child.stdout.on('data', (data) => {
      result += data.toString()
      process.stdout.write(data)
    })

    child.stderr.on('data', (data) => {
      process.stderr.write(data)
      reject(data.toString())
    })

    child.on('close', (code) => {
      resolve(result)
    })
  })
}

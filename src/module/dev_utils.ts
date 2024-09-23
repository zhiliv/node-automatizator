/**
 ** Генерация случайного номера телефона для тестирования
 * @function generateRandomNumber
 */
export const generateRandomNumber = () => {
  return Math.floor(Math.random() * (79999999999 - 79000000000 + 1)) + 79000000000
}

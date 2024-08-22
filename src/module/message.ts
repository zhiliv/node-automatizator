import type {Message} from './../../types/Message.js'

/**
** Получение сообщения для отправки
* @function getMessage
*/
export const getMessage = async (messages: Message[]) => {
  const index: number = messages.findIndex((el) => !el.status)
  if (index === -1) return null
  return messages[index]
}



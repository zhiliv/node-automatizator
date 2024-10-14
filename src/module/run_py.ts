import { Instance } from '../../types/Instances.js'
import { getRandomName } from './utils.js'

/**
 ** Генерация скриптов для эмулятора
 * @function generateScripts
 * @param {isCreate} options - вариант выбора скрипта
 * @param {Instance} instance - экземпляр
 * @param {number} phone - номер телефона
 * @param {string} message - сообщение
 */
export const generateScripts = (options: 'isCreate', instance: Instance, phone: number, message: string): string => {
  let pyScript: string = ``
  pyScript += `\nfrom uiautomator2 import Device`
  pyScript += `\nimport time`
  pyScript += `\ndevice = Device('${instance.id}')`
  pyScript += `\ndevice.shell("am start -a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name "${getRandomName()}" -e phone ${phone}")` // Добавление номера телефона к список контактов

  pyScript += `\nisFirstLaunch = device.xpath("//*[@text='Добавьте аккаунт, чтобы сохранить свои контакты в Google.']").exists` //Проверка первого запуска
  pyScript += `\nif(isFirstLaunch == True):`
  pyScript += `\n\tdevice.xpath("//*[@text='ОТМЕНА']").click()` // Нажатие кнопки "Отменить"`

  pyScript += `\ndevice.xpath('//android.widget.Button[@text="СОХРАНИТЬ"]').click()` // Нажатие кнопки "Сохранить"
  pyScript += `\ntime.sleep(0.5)` // задержка
  pyScript += `\ndevice.shell('am force-stop com.android.contacts')` // закрытие приложения "Контакты"

  pyScript += `\ntime.sleep(1)` // Задержка
  pyScript += `\ndevice.shell('monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1')` // Запуск приложения "WhatsApp"

  pyScript += `\nban1 = device.xpath("//android.widget.TextView[@text='Этот аккаунт больше не может использовать WhatsApp']").exists` //  Проверка наличия бана
  pyScript += `\nban2 = device.xpath("//android.widget.TextView[@text='Этот акка4унт больше не может использовать WhatsApp в связи с рассылкой спама']").exists` //  Проверка наличия бана
  pyScript += `\ntime.sleep(1)`
  pyScript += `\nif (ban1 == True or ban2 == True):`
  pyScript += `\n\tprint('{${instance.id}: true}')`

  pyScript += `\nelse:`
  pyScript += `\n\tdevice.shell('monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1') `
  pyScript += `\n\tif device.xpath("//*[@resource-id='com.whatsapp:id/menuitem_search']").exists == False:`
  pyScript += `\n\t\tdevice.press("back")`
  pyScript += `\n\tdevice.xpath("//*[@resource-id='com.whatsapp:id/menuitem_search']").click();`
  pyScript += `\n\tdevice.xpath("//*[@resource-id='com.whatsapp:id/search_input']").set_text("${phone}")`
  pyScript += `\n\ttime.sleep(1)`
  pyScript += `\n\tchecker = device.xpath("//android.widget.Button[@text='ПРИГЛАСИТЬ']").exists`
  pyScript += `\nif checker == True:`
  pyScript += `\n\t\tprint("{checker: false}")`
  pyScript += `\n\telse:`
  if (options === 'isCreate') {
    pyScript += `\n\t\tdevice.xpath("//*[@resource-id='com.whatsapp:id/contact_row_container']").click()` // Поиск элемента в списке контактов
    pyScript += `\n\t\ttime.sleep(1)` // задержка
    pyScript += `\n\t\tdevice.xpath("//*[@content-desc='Написать сообщение']").set_text('${message}')` // Вставить сообщение
    pyScript += `\n\t\ttime.sleep(0.5)` // задержка
    pyScript += `\n\t\tdevice.xpath("//*[@resource-id='com.whatsapp:id/conversation_entry_action_button']").click()` // Нажатие кнопки "Отправить"
    pyScript += `\n\t\tprint({isSend: true})`
  }
  pyScript += `\n\t\tdevice.press("back")`
  pyScript += `\n\t\tprint({checker: true})`

  // pyScript += `device.shell('am force-stop com.whatsapp')` // закрытие приложения "Whatsapp"
  pyScript += `device.shell('am force-stop com.android.contacts')` // закрытие приложения "Контакты"

  return pyScript
}

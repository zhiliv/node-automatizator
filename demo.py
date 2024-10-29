from uiautomator2 import Device
import time

def is_number(value):
    return isinstance(value, (int, float))

device = Device('127.0.0.1:5555') # Подключение к устройству
device.shell("am start -a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name 'Иван3' -e phone 79087868908")  # Добавление номера телефона к список контактов

isFirstLaunch = device.xpath("//*[@text='Добавьте аккаунт, чтобы сохранить свои контакты в Google.']").exists # Проверка первого запуска
if(isFirstLaunch == True):
  device.xpath("//*[@text='ОТМЕНА']").click() # Нажатие кнопки "Отменить"

device.xpath('//android.widget.Button[@text="СОХРАНИТЬ"]').click() # Нажатие кнопки "Сохранить"

time.sleep(0.5) # задержка
device.shell('am force-stop com.android.contacts') # закрытие приложения "Контакты"

time.sleep(1) # Задержка
device.shell('monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1')  # Запуск приложения "WhatsApp"


ban1 = device.xpath("//android.widget.TextView[@text='Этот аккаунт больше не может использовать WhatsApp']").exists # Проверка наличия бана
ban2 = device.xpath("//android.widget.TextView[@text='Этот аккаунт больше не может использовать WhatsApp в связи с рассылкой спама']").exists # Проверка наличия бана

time.sleep(1)


if (ban1 == True or ban2 == True):
    print('127.0.0.1:5605 isWhatsappBan')

else: 
    device.shell("monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1")
    if (
        device.xpath("//*[@resource-id='com.whatsapp:id/menuitem_search']").exists
        == False
    ):
        device.press("back")
    device.xpath("//*[@resource-id='com.whatsapp:id/menuitem_search']").click()
    device.xpath("//*[@resource-id='com.whatsapp:id/search_input']").set_text(
        "79087868908"
    )
    time.sleep(1)
    checker = device.xpath("//android.widget.Button[@text='ПРИГЛАСИТЬ']").exists
    if checker == True:
        print(False)
    else:
        device.xpath("//*[@resource-id='com.whatsapp:id/contact_row_container']").click()
        time.sleep(1)
        device.xpath("//*[@content-desc='Написать сообщение']").set_text('Привет')
        time.sleep(0.5)
        device.xpath("//*[@resource-id='com.whatsapp:id/conversation_entry_action_button']").click()
        device.press("back")
        print(True)


# device.shell('am force-stop com.whatsapp') # закрытие приложения "Whatsapp"
device.shell('am force-stop com.android.contacts') # закрытие приложения "Контакты"

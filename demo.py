from uiautomator2 import Device
import time

def is_number(value):
    return isinstance(value, (int, float))

device = Device('127.0.0.1:5605')
device.shell("am start -a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name 'Иван3' -e phone 790878689082")
device.xpath('//android.widget.Button[@text="СОХРАНИТЬ"]').click()
time.sleep(0.5)
device.shell('am force-stop com.android.contacts')

time.sleep(1)
device.shell('monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1') 
ban1 = device.xpath("//android.widget.TextView[@text='Этот аккаунт больше не может использовать WhatsApp']").exists
ban2 = device.xpath("//android.widget.TextView[@text='Этот аккаунт больше не может использовать WhatsApp в связи с рассылкой спама']").exists

time.sleep(1)


if (ban1 == True or ban2 == True):
  print('127.0.0.1:5605 isWhatsappBan')

else: 
  
  device.shell('monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1') 
  if device.xpath("//*[@resource-id='com.whatsapp:id/menuitem_search']").exists == False: 
    device.press("back")
  device.xpath("//*[@resource-id='com.whatsapp:id/menuitem_search']").click();     
  device.xpath("//*[@resource-id='com.whatsapp:id/search_input']").set_text("790878689082")
  time.sleep(1)
  checker = device.xpath("//android.widget.Button[@text='ПРИГЛАСИТЬ']").exists
  print('checker', checker)
  if checker == True:
    print(False)
  else:
    print(True)
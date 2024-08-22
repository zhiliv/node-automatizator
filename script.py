from uiautomator2 import Device
import time
device = Device('127.0.0.1:62025')
time.sleep(1.299)
print(device.xpath("//android.widget.ListView/android.widget.RelativeLayout[@index='4']/android.widget.LinearLayout[@index='2']/android.widget.Button[@index='0']").exists)
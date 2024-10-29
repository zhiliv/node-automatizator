
import type { Instance } from '../types/Instances.js';
import { spawn } from 'child_process'
import adb from 'adbkit'
var client = adb.createClient()


const ins: Instance = {
  id: '127.0.0.1:5555',
  display_name: '123',
  adb_port: 5555,
  isActive: true,
}

      var args = ["-m", "uiautomator2", "init", "--serial", ins.id]
      
      const scr = `
      \nfrom uiautomator2 import Device
      \ndevice = Device('127.0.0.1:${ins.adb_port}')
      \ncheckWhatsappRun = device.shell('pgrep com.whatsapp').output
      \nif checkWhatsappRun > 0:
      \n\tprint('run')
      \ndevice.shell('monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1')
      \ncheckContact = device.xpath("//android.widget.Button[@text='ПРИГЛАСИТЬ']").exists
      \nif checkContact== False:
      \n\tprint("dddd");
      `
      
      
       /*      const scr = `
      \nfrom uiautomator2 import Device
      \ndevice = Device('127.0.0.1:${ins.adb_port}')
      
      \ncheckContact = device.xpath("//android.widget.Button[@text='ПРИГЛАСИТЬ']").exists
      \nif checkContact== False:
      \n\tprint("dddd")
      ` */
      console.log(scr)
      
      const child = spawn('python')
      
      child.stdin.cork()
      child.stdin.write(scr)  
      child.stdin.end()
      
      
      child.stdout.on("data", data => {
        
      process.stdout.write(data)
      })
      child.stderr.on("data", data => {
        
        process.stderr.write(data)
      })
      child.on('close', code => {
        
      });
      
      
      



//console.log(await addContact(ins, 79087868908))

//console.log(await getAllContacts(ins))
//console.log(await startAppContact(ins))


import { Worker } from 'worker_threads'
import { setInstanceDB, getInstancesDB, startInstances } from './module/bluestack.js'
import { Instance } from './../types/Instances.js'
import { getRandomNumber } from './module/utils.js'
import { getLastProneQueue } from './module/redis.js'

// console.log(await getLastProneQueue())

function delay(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout)
  })
}

/**
 ** Запуск процесса обработки сообщений
 * @async
 * @function startProcessWorker
 * @return {Promise<void>}
 */
async function startProcessWorker(){
  
    await setInstanceDB()
    const instances: Instance[] = await getInstancesDB()
    await startInstances(instances[0])

    const worker: Worker = new Worker('./dist/src/module/process.js', {
      workerData: {
        instance: instances[0],
      },
    })
    worker.on('message', (data: string | boolean) => {
      /* if (data === null) {
        
        return
      }
      if(data === true){
      return delay(1).then(function () {
        process.nextTick(startProcessWorker)
      })
      } */
    })
    worker.on('error', console.error)
    worker.on('exit', async () => {
      return delay(1).then(function () {
        process.nextTick(startProcessWorker)
      })
    })
  
}

startProcessWorker()

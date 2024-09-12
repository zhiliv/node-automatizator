import { Worker } from 'worker_threads'
import { setInstanceDB, getInstancesDB, startInstances } from './module/bluestack.js'
import { Instance } from './../types/Instances.js'
import { getRandomNumber } from './module/utils.js'
import { getLastProneQueue } from './module/redis.js'

// console.log(await getLastProneQueue())

/**
 ** Запуск процесса обработки сообщений
 * @async
 * @function startProcessWorker
 * @return {Promise<void>}
 */
const startProcessWorker = async (): Promise<string | boolean> => {
  return new Promise(async (resolve, reject) => {
    await setInstanceDB()
    const instances: Instance[] = await getInstancesDB()
    await startInstances(instances[0])

    const worker: Worker = new Worker('./dist/src/module/process.js', {
      workerData: {
        instance: instances[0],
      },
    })
    worker.on('message', (data: string | boolean) => {
      if (data === null) {
        resolve(data)
      }
      if(data === true){
      setTimeout(async () => {
         startProcessWorker()
      }, 1000)  
      }
    })
    worker.on('error', reject)
    worker.on('exit', async () => {
      setTimeout(async () => {
        startProcessWorker()
      }, 1000)  
    })
  })
}

startProcessWorker()

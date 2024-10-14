import { Worker } from 'worker_threads'
import { setInstanceDB, getInstancesDB, startInstances } from './module/bluestack.js'
import { Instance } from './../types/Instances.js'
import { getLastProneQueue } from './module/redis.js'



// console.log(await getLastProneQueue())

function delay(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout)
  })
}

await setInstanceDB()
let instances: Instance[] = await getInstancesDB()
for await (let instance of instances) {
    await startInstances(instance)
}

/**
 ** Запуск процесса обработки сообщений
 * @async
 * @function startProcessWorker
 * @return {Promise<void>}
 */
async function startProcessWorker(instanceControl?: Instance) {
  await setInstanceDB()
  let instances: Instance[] = await getInstancesDB()
  // instances = instances.filter((instance: Instance) => instance.isWhatsappBan === false) // Получение незабаненных устройств

  for await (let instance of instances) {
    await startInstances(instance)
    const worker: Worker = new Worker('./dist/src/module/process.js', {
      workerData: {
        instance: instanceControl ? instanceControl : instance,
      },
    })
    worker.on('error', console.error)
    worker.on('exit', async () => {
      return delay(1).then(function () {
        startProcessWorker(instance)
      })
    })
  }
}

startProcessWorker()

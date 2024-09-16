import { Worker } from 'worker_threads';
import { setInstanceDB, getInstancesDB, startInstances } from './module/bluestack.js';
// console.log(await getLastProneQueue())
function delay(timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
}
/**
 ** Запуск процесса обработки сообщений
 * @async
 * @function startProcessWorker
 * @return {Promise<void>}
 */
async function startProcessWorker() {
    await setInstanceDB();
    const instances = await getInstancesDB();
    await startInstances(instances[0]);
    const worker = new Worker('./dist/src/module/process.js', {
        workerData: {
            instance: instances[0],
        },
    });
    worker.on('message', (data) => {
        /* if (data === null) {
          
          return
        }
        if(data === true){
        return delay(1).then(function () {
          process.nextTick(startProcessWorker)
        })
        } */
    });
    worker.on('error', console.error);
    worker.on('exit', async () => {
        return delay(1).then(function () {
            process.nextTick(startProcessWorker);
        });
    });
}
startProcessWorker();

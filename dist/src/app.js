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
async function startProcessWorker(instanceControl) {
    await setInstanceDB();
    let instances = await getInstancesDB();
    // instances = instances.filter((instance: Instance) => instance.isWhatsappBan === false) // Получение незабанненных устройств
    console.log("🚀 -> startProcessWorker -> instances:", instances);
    for await (let instance of instances) {
        await startInstances(instance);
        const worker = new Worker('./dist/src/module/process.js', {
            workerData: {
                instance: instanceControl ? instanceControl : instance,
            },
        });
        worker.on('error', console.error);
        worker.on('exit', async () => {
            return delay(1).then(function () {
                startProcessWorker(instance);
            });
        });
    }
}
startProcessWorker();

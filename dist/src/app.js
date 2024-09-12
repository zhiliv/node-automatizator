import { Worker } from 'worker_threads';
import { setInstanceDB, getInstancesDB, startInstances } from './module/bluestack.js';
// console.log(await getLastProneQueue())
/**
 ** Запуск процесса обработки сообщений
 * @async
 * @function startProcessWorker
 * @return {Promise<void>}
 */
const startProcessWorker = async () => {
    return new Promise(async (resolve, reject) => {
        await setInstanceDB();
        const instances = await getInstancesDB();
        await startInstances(instances[0]);
        const worker = new Worker('./dist/src/module/process.js', {
            workerData: {
                instance: instances[0],
            },
        });
        worker.on('message', (data) => {
            if (data === null) {
                resolve(data);
            }
            if (data === true) {
                setTimeout(async () => {
                    startProcessWorker();
                }, 1000);
            }
        });
        worker.on('error', reject);
        worker.on('exit', async () => {
            setTimeout(async () => {
                startProcessWorker();
            }, 1000);
        });
    });
};
startProcessWorker();

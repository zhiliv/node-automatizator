import { Worker } from 'worker_threads';
/**
 ** Запуск процесса обработки сообщений
 * @async
 * @function startProcessWorker
 * @return {Promise<void>}
 */
const startProcessWorker = async () => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./dist/src/module/process.js');
        worker.on('message', (data) => {
            if (data === null) {
                resolve(data);
            }
        });
        worker.on('error', reject);
        worker.on('exit', async () => {
            setTimeout(async () => {
                await startProcessWorker();
            }, 60000);
        });
    });
};
startProcessWorker();

import express from 'express';
import { router } from './routers/routers.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Worker } from 'worker_threads';
export const app = express();
app.use(bodyParser.json({ limit: '300mb' }));
app.use(cors());
app.use('/', router);
app.listen(3000, () => {
    console.warn(`Сервер запущен на  ${3000} порту`);
});
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

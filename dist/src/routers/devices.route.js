import express from 'express';
import fs from 'fs';
export const deviceRouter = express.Router();
/* Получение списка запущенных эмуляторов */
deviceRouter.get('/list', async (req, res) => {
    try {
        const devices = await fs.readFileSync('../../data/devices.json');
        res.send(devices);
    }
    catch (err) {
        res.send(`Ошибка получения данных о запущенных устройствах: ${err}`);
    }
});

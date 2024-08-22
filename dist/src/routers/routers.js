import express from 'express';
import { deviceRouter } from './devices.route.js';
import { MessageRouter } from './messages.route.js';
import { authRoute } from './auth.route.js';
export const router = express.Router();
router.use((req, res, next) => {
    authRoute(req, res, next);
});
export const routers = [
    {
        path: '/devices',
        route: deviceRouter,
    },
    {
        path: '/messages',
        route: MessageRouter,
    }
];
routers.forEach((route) => router.use(route.path, route.route));

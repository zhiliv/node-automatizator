import express from 'express';
import { PhoneRouter } from './phones.route.js';
import { authRoute } from './auth.route.js';
export const router = express.Router();
router.use((req, res, next) => {
    authRoute(req, res, next);
});
export const routers = [
    /* {
      path: '/devices',
      route: deviceRouter,
    }, */
    /* {
      path: '/messages',
      route: MessageRouter,
    }, */
    {
        path: '/phones',
        route: PhoneRouter,
    },
];
routers.forEach((route) => router.use(route.path, route.route));

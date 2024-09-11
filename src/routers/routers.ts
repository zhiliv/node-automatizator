import express from 'express'
import { deviceRouter } from './devices.route.js'
import { MessageRouter } from './messages.route.js'
import { PhoneRouter } from './phones.route.js'
import { authRoute } from './auth.route.js'
import type { ListRoute } from '../../types/Route.type.ts'
import type { Router } from 'express'

export const router: Router = express.Router()
router.use((req, res, next) => {
  authRoute(req, res, next)
})

export const routers: ListRoute[] = [
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
]

routers.forEach((route: ListRoute) => router.use(route.path, route.route))

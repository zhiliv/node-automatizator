import type { Router } from 'express'

/**
* Роуты для подключения
* @interface ListRoute
* @member {String} path - путь к роуту
* @member {Router} route - модуль обработки роута
*/
export interface ListRoute {
  path: string
  route: Router
}

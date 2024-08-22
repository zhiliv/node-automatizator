import type { Response, NextFunction } from 'express'
import type { RequestAuth } from '../../types/Auth.type.ts'
const isDev = process.env?.npm_lifecycle_script?.indexOf('isDev=true') < 0 ? false : true // признак запуска проекта в режиме разработки

export const authRoute = (req: RequestAuth, res: Response, next: NextFunction) => {
  const query = req.query || req.body
  if (query.token === 'Cbo28-4oS4LJfnxJTcrAx0D92' || isDev) {
    next()
  } else {
    res.status(401).send('Ошибка авторизации')
  }
}

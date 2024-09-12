import { Redis, RedisOptions } from 'ioredis'
import chalk from 'chalk'
import fs from 'fs'

const redisConnect = (): Promise<Redis> => {
  return new Promise((resolve, reject) => {
    try {
      const options: RedisOptions = {
        host: 'c-c9q6fgv3mpndqm157s5g.rw.mdb.yandexcloud.net',
        port: 6380,
        password: 'fD3-bLR-QR3-JfV',
        tls: {
          ca: fs.readFileSync('certs/YandexInternalRootCA.crt'),
        },
        maxRetriesPerRequest: null,
        reconnectOnError(err) {
          const targetError = 'READONLY'
          if (err.message.includes(targetError)) {
            return true
          }
        },
      }
      const connect = new Redis(options)

      connect.on('error', (err) => {
        console.error(chalk.red(`Ошибка подключения к redis: ${err}`))
        reject(false)
      })

      resolve(connect)
    } catch (err: any) {
      console.error(chalk.red(`Ошибка подключения к redis: ${err}`))
      reject(false)
    }
  })
}

export const redis = await redisConnect()

export const getLastProneQueue = async () => {
  const phone = await redis.rpop('queue_checker_whatsapp')
  const result: { phone: number; date_add: string} = JSON.parse(phone)
  return result
}

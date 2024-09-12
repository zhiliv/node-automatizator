import pg from 'pg'
import fs from 'fs'
import { ConnectionConfig, QueryArrayResult, QueryResult } from 'pg'
import chalk from 'chalk'
import type { Count } from './../../types/Count.js'

const options: ConnectionConfig = {
  host: 'rc1a-5unamtx70en7he58.mdb.yandexcloud.net',
  port: 6432,
  database: 'bots',
  user: 'administrator',
  password: 'fbF-Y8d-MF2-X4p',
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('certs/YandexInternalRootCA.crt').toString(),
  },
}

const db = new pg.Pool(options)

try {
  await db.connect()
} catch (err: any) {
  console.log(chalk.red('Нет возможности подключиться к базе данных'), chalk.yellow(err.toString()))
}

/**
 ** Проверка наличия контакта в БД
 * @function checkPhoneWhatsappDB
 * @param {number} phone - Номер телефона
 */
export const checkPhoneWhatsappDB = async (phone: number): Promise<number | boolean> => {
  const sql: string = `
    SELECT 
      COUNT(*) 
    FROM 
      whatsapp.checker
    WHERE phone = '${phone}'`

  try {
    const result = await db.query(sql)

    const row: Count = result.rows[0]
    return row.count
  } catch (err) {
    console.log('🚀 -> checkPhoneWhatsappDB -> err:', err)
    return false
  }
}

/**
 ** Добавление результата проверки в БД
 * @function insertCheckWhatsapp
 * @param {number} phone - Номер телефона
 * @param {boolean} status - Статус проверки
 * @param {string} instanceID - идентификатор экземпляра эмулятора
 */
export const insertCheckWhatsapp = async (phone: number, status: boolean, instanceID: string): Promise<boolean> => {
  const check = await checkPhoneWhatsappDB(phone)

  if (check === null) {
    return null
  }

  if (+check === 0) {
    try {
      const sql: string = `INSERT INTO whatsapp.checker(phone, instance, status) VALUES($1, $2, $3) RETURNING *`
      const obj: { phone: number; status: boolean; instance: string } = {
        phone: phone,
        instance: instanceID,
        status: status,
      }
      await db.query(sql, Object.values(obj))
      return true
    } catch (err) {
      return false
    }
  }
}

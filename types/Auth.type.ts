import type { Request } from 'express'


export interface RequestAuth extends Request {
  
  query: any
  body: any
}

import * as Express from 'express'

declare module 'express' {
  interface RequestParams {
    query?: any
    params?: any
    body?: any
  }

  interface ExRequest<T extends RequestParams> extends Express.Request {
    params: T['params']
    query: T['query']
    body: T['body']
  }
}

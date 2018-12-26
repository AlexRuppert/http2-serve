import cors from '@koa/cors'
import compress from 'kompression'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import logger from 'koa-morgan'
import serve from 'koa-static-server'
import path from 'path'
import ignoreFavicon from './middlewares/ignore-favicon'
import indexer from './middlewares/indexer'

export default [
  ignoreFavicon(),
  logger('dev'),
  cors(),
  compress({
    threshold: 256,
  }),
  indexer({ rootDir: 'C:/Coding' }),
  conditional(),
  etag(),
  serve({ rootDir: 'C:/Coding' }),
]

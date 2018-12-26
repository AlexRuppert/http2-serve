import Koa from 'koa'
import deepExtend from 'deep-extend'
import http2 from 'http2'

import middlewares from './middlewares'
import defaults from './defaults'

export default class Server {
  private server: Koa

  constructor(options: any = {}) {
    deepExtend(options, defaults)
    this.server = new Koa()
    middlewares.forEach(m => this.server.use(m))
    http2.createSecureServer(options, this.server.callback()).listen(options.port)
  }
}

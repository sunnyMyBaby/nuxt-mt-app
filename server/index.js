import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import moongose from 'mongoose'

// 处理相关get,post请求信息
import bodyParser from 'koa-bodyparser'
// 处理session
import session from 'koa-generic-session'
import Redis from 'koa-redis'
// 美化json
import json from 'koa-json'

import config from '../nuxt.config.js'

import dbConfig from './dbs/config'

import passport from './interface/utils/passport'

import users from './interface/users'

import geo from './interface/geo'

import search from './interface/search'

const app = new Koa()
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3333
  } = nuxt.options.server

  // session加密
  app.keys = ['mt', 'mtkeys']
  app.use(session({
    key: 'mt', // 登录成功之后cookie里里边会有mt.sig sig（签名）
    prefix: 'mt:uid', // 因为session将来会处理到cookie中加上这个将来好识别
    store: new Redis({
      port: '6379',
      host: '39.96.4.34',
      password: 'wwyg718029?'
    }) // 我们希望把一些session借助redis去存储
  }))

  app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
  }))

  app.use(json())

  // 链接数据库
  moongose.connect(dbConfig.dbs, {
    useNewUrlParser: true
  })

  // 登录相关
  app.use(passport.initialize())
  app.use(passport.session())

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // 加载users路由-固定写法
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

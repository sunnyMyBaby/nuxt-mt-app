// 用户中心接口
import Router from 'koa-router'

// 这里为啥用redis？想想如果服务端给大家发送验证码，
// 如果有100个人同时注册那么如何把这些验证码和注册的用户一一对应上所以，
// 如果我们把这些用户名和验证码通过简历一个hash表放在内存中那么内存溢出的时候就会出问题所以要写入redis
import Redis from 'koa-redis'

// 在node中用我们注册的腾讯邮箱SMTP服务，如何给我们填写的邮箱发送消息
import nodeMailer from 'nodemailer'

import Users from '../dbs/models/users'

import Email from '../dbs/config'

import Passport from './utils/passport'

import axios from './utils/axios'

const router = new Router({
  // 用户中心写的路由都必须有有users的前缀
  prefix: '/users'
})

// 获取redis的客户端
const Store = new Redis({
  port: '6379',
  host: '39.96.4.34',
  password: 'wwyg718029?'
}).client

// 1、 注册接口
router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body
  if (code) {
    // 验证验证码-nodemailer在发验证码的时候会在redis中存起来，这里要把存的验证码取出来
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    // 获取过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试！'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码！'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码！'
    }
  }
  const user = await Users.find({
    username
  })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '该账号已被注册'
    }
  }

  // 用户名验证码检验陈成功-写入库
  const nuser = Users.create({
    // 创建一个写库的动作
    username,
    password,
    email
  })
  if (nuser) {
    const res = await axios.post('/users/signin', {
      username,
      password
    })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

// 2、 登录
router.post('/signin', (ctx, next) => {
  // 调local策略,登录成功后就会把用户信息存储到session中，下面我们就可以通过
  // ctx.session.passport.user拿到数据
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else if (user) {
      ctx.body = {
        code: 0,
        msg: '登录成功',
        user
      }
      // 做一个登录的动作
      // 是进行session存储， 这里是存储到redis
      // index.js下面的Redis
      return ctx.login(user)
    } else {
      ctx.body = {
        code: 1,
        msg: info
      }
    }
  })(ctx, next)
})

// 3、 验证码
router.post('/verify', async (ctx, next) => {
  const username = ctx.request.body.username
  // 获取过期时间
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，一分钟内一次'
    }
    return false
  }
  // 发邮件-谁发的
  const transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 信息
  const ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  // 邮件中要显示什么内容
  const mailOptions = {
    from: `"认证邮件"<${Email.smtp.user}>`,
    to: ko.email,
    subject: '《node+koa2+nuxt.js+mongodb+redis学习项目》',
    html: `您在《node+koa2+nuxt.js+mongodb+redis学习项目》中的注册码是${ko.code}`
  }
  // 发送
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log('验证码发送失败')
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延迟，有效期1分钟！'
  }
})

// 4、退出

router.get('/exit', async (ctx, next) => {
  // 执行一个退出的动作
  await ctx.logout()
  // 检查现在是否是登录状态
  // isAuthenticated/logout 这些api是passport提供的
  console.log(ctx.isAuthenticated())
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

// 5、获取用户信息

router.get('/getUser', (ctx) => {
  // ctx.isAuthenticated() 这个是passport封装的api， 用来管理session
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router

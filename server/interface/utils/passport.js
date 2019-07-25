// 验证权限内库-验证方式  https://www.jianshu.com/p/622561ec7be2
// https: //segmentfault.com/a/1190000011557953
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

passport.use(new LocalStrategy(async function (username, password, done) {
  const where = {
    username
  }
  const result = await UserModel.findOne(where)
  if (result != null) {
    // 查出来的pwd和用户输入的pwd
    if (result.password === password) {
      return done(null, result)
    } else {
      return done(null, false, '密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

// 让用户进来每次都通过session去验证,我们要做一个序列化的动作
passport.serializeUser(function (user, done) {
  // 用户登录成功之后会把用户信息存储到session中，打到cookie中
  done(null, user)
})

// 反序列化
passport.deserializeUser(function (user, done) {
  return done(null, user)
})

export default passport

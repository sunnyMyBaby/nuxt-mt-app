// 数据库的链接配置--邮箱服务配置

export default {
  dbs: 'mongodb://39.96.4.34:19999/mtApp',
  redis: {
    get host() {
      return '39.96.4.34'
    },
    get port() {
      return '6379'
    },
    get password() {
      return 'wwyg718029?'
    }
  },
  // 腾讯邮箱配置
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return '1256766395@qq.com'
    },
    // 这个授权码是在qq邮箱的设置-》用户-》-》开启服务：POP3/SMTP服务，IMAP/SMTP服务这两个服务开启后生成的
    get pass() {
      return 'kclkuwqdkhdmgiag'
    },
    // 生成随机四位数验证码
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    // 验证码过期时间,过期时间一分钟
    get expire() {
      return () => {
        return new Date().getTime() + 60 * 60 * 1000
      }
    }
  }
}

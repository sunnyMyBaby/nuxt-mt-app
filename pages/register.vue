<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a
          href="/"
          class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button
              type="primary"
              size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item
          label="昵称"
          prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button
            size="mini"
            round
            @click="sendMsg">
            发送验证码
          </el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="code">
          <el-input
            v-model="ruleForm.code"
            maxlength="4" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd">
          <el-input
            v-model="ruleForm.pwd"
            type="password" />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="cpwd">
          <el-input
            v-model="ruleForm.cpwd"
            type="password" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="register">
            同意以下协议并注册
          </el-button>
          <div class="error">
            {{ error }}
          </div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="http://www.meituan.com/about/terms"
            target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
// 前端密码加密库
import cryptoJs from 'crypto-js'
export default {
  data() {
    return {
      statusMsg: '',
      error: '',
      ruleForm: {
        name: '',
        code: '',
        pwd: '',
        cpwd: '',
        email: ''
      },
      rules: {
        name: [{
          required: true,
          type: 'string',
          message: '请输入昵称',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  //  制定外层是blank组件
  layout: 'blank',
  methods: {
    sendMsg: function () {
      const self = this
      let namePass
      let emailPass
      console.log(self.timerid)
      if (self.timerid) {
        return false
      }
      this.$refs.ruleForm.validateField('name', (valid) => {
        namePass = valid
      })
      self.statusMsg = ''
      if (namePass) {
        return false
      }
      this.$refs.ruleForm.validateField('email', (valid) => {
        emailPass = valid
      })
      if (!namePass && !emailPass) {
        // 1256766395@qq.com
        this.$axios.post('/users/verify', {
          username: encodeURIComponent(self.ruleForm.name), // 要对中文编码
          email: self.ruleForm.email
        }).then(({
          status,
          data
        }) => {
          if (status === 200 && data && data.code === 0) {
            let count = 60
            self.statusMsg = `验证码已发送,剩余${count--}秒`
            self.timerid = setInterval(function () {
              self.statusMsg = `验证码已发送,剩余${count--}秒`
              if (count === 0) {
                self.statusMsg = ''
                clearInterval(self.timerid)
                self.timerid = null
              }
            }, 1000)
          } else {
            self.statusMsg = data.msg
          }
        })
      }
    },
    register: function () {
      const self = this
      this.$refs.ruleForm.validate((valid) => {
        // valid  === true 证明所有验证成功
        if (valid) {
          this.$axios.post('/users/signup', {
            username: encodeURIComponent(self.ruleForm.name), // 要对中文编码
            email: self.ruleForm.email,
            password: cryptoJs.MD5(self.ruleForm.pwd).toString(),
            code: self.ruleForm.code
          }).then(({ status, data }) => {
            if (status === 200) {
              self.error = `服务器出错，错误码:${status}`
              if (data && data.code === 0) {
                location.href = '/login'
              } else {
                self.error = data.msg
              }
            } else {
              self.error = `服务器出错，错误码:${status}`
            }
            setTimeout(function () {
              self.error = ''
            }, 1500)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/register/index.scss";
</style>

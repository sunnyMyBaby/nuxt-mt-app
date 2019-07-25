// 对象模型-用户中心模型
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UsersSchema = new Schema({
  username: {
    type: String,
    unique: true, // 唯一的
    required: true // 必须的
  },
  password: {
    type: String,
    required: true // 必须的
  },
  email: {
    type: String,
    required: true
  }
})

export default mongoose.model('UsersSchema', UsersSchema)

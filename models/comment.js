const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  name: {type: String, default: '匿名'},//评论者名字
  like: {type: Number, default: 0},//喜欢的数量
  dislike: {type: Number, default: 0},//不喜欢的数量
  pid: {type: String, default: ''},//属于哪个评论（或一级评论）
  content: {type: Array, required: true},//评论内容
  cHistory: {type: Object, default:{}},//Cookie历史用于识别重复操作
  time: {type: Date, default: () => new Date()},//创建时间
})

const commentModel = mongoose.model('comment', commentSchema)

module.exports = commentModel

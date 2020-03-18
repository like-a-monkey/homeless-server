const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
  name: {type: String, required: true},//昵称
  place: {type: String, required: true},//地点
  breed: {type: String, required: true},//品种
  state: {type: Number, required: true, default: 0},//状态 （ 流浪(0) 被领养  死亡等）
  tags: {type: Array, required: true},//分类标签
  imgs: {type: Array, default: []},//照片地址
  des: {type: String,required: true},//描述
  owner: {type: String, default: 0},//主人姓名
  phone: {type: Number, default: 0},//联系方式
  address: {type: String, default: 0},//地址
})

const animalModel = mongoose.model('animals', animalSchema)

module.exports = animalModel

const mongoose = require('mongoose')

const adopterSchema = new mongoose.Schema({
  pets: {type:Array, required:true}, //领养动物列表
  name: {type: String, required: true},//姓名
  gender: {type: Number, required: true},//性别
  age: {type: Number, required: true},//年龄
  sID: {type: Number, required: true, default: 0},//学号
  address: {type: String, required: true},//地址
  phone: {type: Number, required: true},//手机号码
  e_mail: {type: String,required: true},//邮箱
  contact: {type: String, default: ''},//其他联系方式
  status: {type: Number, default: 0},//状态
a  rate: {type: Number, default: 5},//评分
  remarks: {type: String, default: ''},//备注
})

const adopterModel = mongoose.model('adopter', adopterSchema)

module.exports = adopterModel

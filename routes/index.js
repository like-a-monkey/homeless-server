var express = require('express');
var router = express.Router();
const AnimalModel = require('../models/animal')
const AdopterModel = require('../models/adopter')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('nothing');
})
router.post('/animal/add', function(req, res, next) {
  // {name, place, breed, tags, imgs, des}
  const {animal} = req.body
  AnimalModel.find({name: animal.name})
    .then(animals => {
      if(animals.length){
        res.send({status:1, msg:'试试与众不同的小名吧'})
      } else {
        animal.status = 0
        AnimalModel.create(animal).then((animal) => {
        res.send({status: 0, data: animal})
        })
      }
    })
})
router.post('/animal/update', function(req, res) {
  const {animal} = req.body
  AnimalModel.findByIdAndUpdate(animal._id, {...animal}, function(err, animal) {
    if(!err){
      res.send({status:0, data: animal})
    } else {
      console.log(err)
    }
  })
})
router.get('/animal/search', function(req, res) {
  const {keyword} = req.query
  AnimalModel.find({$or: [{tags: {$regex:keyword}}, {name: {$regex:keyword}}, {place: {$regex:keyword}}]})
    .then(animal => {
    res.send({status: 0, data:animal})
  })
})
router.get('/animal/list', function(req, res, next) {
  const {pageNum} = req.query
  const pageSize = 6
  AnimalModel.find({}).then(animals => {
    if(pageNum) {
      //带分页搜索
      res.send({status:0, data: pageFilter(animals, pageNum, pageSize)})
    } else {
      //无分页
      res.send({status:0, data: animals})
    }
  }).catch(error => {
    res.send({status:1, msg: '请求错误'})
  })
})
router.post('/adopter/adopt', function(req, res) {
  const {adopter} = req.body
  AdopterModel.find({sID: adopter.sId})
    .then(existAdopter => {
      if(existAdopter._id){
        AdopterModel.findByIdAndUpdate(existAdopter._id, {pets: existAdopter.pets.push(adopter.pet)}, function(err, data){
          //更新收养人信息
          if(!err) {
            AnimalModel.findByIdAndUpdate(adopter.pet, {phone: adopter.phone, address: adopter.address, state: 1}, function(err, pdata) {
              if(!err) res.send({status:0, data})
            })
          }
        })
      } else {
        AdopterModel.create(adopter).then(newAdopter => {
          AnimalModel.findByIdAndUpdate(adopter.pet, {owner: adopter.name, phone: adopter.phone, address: adopter.address, state: 1}, function(err, pdata) {
            if(!err) res.send({status: 0, data: newAdopter})
          })
        })
      }
    })
})



require('./file-upload')(router)
function pageFilter(animals, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = animals.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (let i = start; i < end; i++) {
    list.push(animals[i])
  }
  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}
module.exports = router;

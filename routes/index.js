var express = require('express');
var router = express.Router();
const AnimalModel = require('../models/animal')
const AdopterModel = require('../models/adopter')
const CommentModal = require('../models/comment')
/* GET home page. */
// AdopterModel.deleteMany({name: '彭绍杰'}, function(err, data) {console.log(data)})
// CommentModal.deleteMany({content: '123'}, function(err, data) {console.log(data)})
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
  if(!animal.address && !animal.phone && !animal.owner){
    //更新流浪状态（领养 => 流浪）
    [animal.address, animal.phone, animal.owner] = ['', 0, '']
    AdopterModel.findOne({pets: {$regex:animal._id}}, function(err, data) {
      if(data) {
        const index = data.pets.indexOf(animal._id)
        data.pets.splice(index, 1)
        data.date.splice(index, 1)
        AdopterModel.findByIdAndUpdate(data._id, {pets: data.pets, date: data.date}, function(err, fdata) {
          if(!err) console.log('同步更新主人信息')
        })
      }
    })
  }
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
  console.log(adopter.date)
  AdopterModel.findOne({sID: (adopter.sID * 1)})
    .then(existAdopter => {
      console.log(existAdopter)
      if(existAdopter) {
        const date = existAdopter.date.concat(adopter.date)
        const pets = existAdopter.pets.concat(adopter.pets)
        console.log(existAdopter.date.concat(adopter.date))
        AdopterModel.findByIdAndUpdate(existAdopter._id, {pets, date}, function(err, data){
          //更新收养人信息
          if(!err) {
            AnimalModel.findByIdAndUpdate(adopter.pets.toString(), {phone: adopter.phone, address: adopter.address, state: 1, owner: adopter.name}, function(err, pdata) {
              if(!err) res.send({status:0, data})
            })
          }
        })
      } else {
        //新建收养人信息
        AdopterModel.create(adopter).then(newAdopter => {
          AnimalModel.findByIdAndUpdate(adopter.pets.toString(), {owner: adopter.name, phone: adopter.phone, address: adopter.address, state: 1}, function(err, pdata) {
            if(!err) res.send({status: 0, data: newAdopter})
          })
        })
      }
    })
})
router.post('/adopter/rate', function(req, res) {
  const {_id, rate} = req.body
  AdopterModel.findByIdAndUpdate(_id, {rate}, function(err, data) {
    res.send({status: 0, data})
  })
})
router.post('/comment/add', function(req, res, next) {
  //content pid
  const {comment} = req.body
  CommentModal.create(comment)
    .then(data => {
      // 5e7353e42263e109f48eadfe
      // 5e73542a0b9fb31d4c768aac
      res.send({status: 0, data})
      console.log(data)
    })
})
router.get('/comment/list', function(req, res) {
  CommentModal.find({}, function(err, data) {
    res.send({status: 0, data})
  })
})
router.post('/comment/update', function(req, res) {
  const sign = req.cookies.userid//用于标记用户
  const {comment} = req.body
  CommentModal.findById(comment._id, function(err, initialdata) {
    if(initialdata.cHistory[sign] === comment.attitude) {
      delete initialdata.cHistory[sign] //取消原状态
    } else {
      initialdata.cHistory[sign] = comment.attitude//添加或更新状态
    }
    CommentModal.findByIdAndUpdate(comment._id,
      {cHistory: initialdata.cHistory, like: statistics(initialdata.cHistory)[0], dislike: statistics(initialdata.cHistory)[1]},
      function(err, data) {
        res.send({status: 0, data})
      })
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
function statistics(cHistory) {
  let [lcounter, dcounter] = [0, 0]
  for(let val in cHistory) {
    if(cHistory[val] === 1) {
      lcounter = lcounter + 1
    } else if(cHistory[val] === 0) {
      dcounter = dcounter + 1
    }
  }
  return [lcounter, dcounter]
}
module.exports = router;

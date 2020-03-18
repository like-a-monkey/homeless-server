var mongoose = require('mongoose')
var express = require('express')
var app = express()

app.get('/query', function(req, res) {
  const {name} = req.query
  clientModal.find({name})
    .then((client) => res.send({code: 1, client}))
    .catch(err => {
      console.log(err);
      res.send({code: 0, msg: '出错了'})})
})
var my_bouse = 123
var mydog = 123

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var app = express();
// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);


mongoose.connect('mongodb://localhost/animal', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('数据库已连接')
  }).catch((err) => {
    console.log('连接至数据库失败', err)
})
module.exports = app;

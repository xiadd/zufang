/**
 * Created by xiadd on 7/21/16.
 */
'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');
const nunjucks =require('nunjucks');

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('html', nunjucks.render);
app.set('view engine', 'html');
app.use(express.static('public'));

// 设置默认超时时间
app.use(timeout('15s'));

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.express());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/demo', function (req, res) {
  res.send('demo');
});

module.exports = app;

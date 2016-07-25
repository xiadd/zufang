'use strict';
var AV = require('leanengine');
var express = require('express');
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

var app = require('./server/app');
app.use(express.static('./public'));

// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || 3000);

var isDev = process.env.NODE_ENV === 'dev'; //判断是否处于开发环境

if (isDev) {
  var path = require('path');

  var webpack = require('webpack');
  var config = require('./client/config');
  var proxyMiddleware = require('http-proxy-middleware');
  var webpackConfig = isDev
    ? require('./client/build/webpack.dev.conf.js')
    : require('./client/build/webpack.prod.conf.js');

  var proxyTable = config.dev.proxyTable;

  var compiler = webpack(webpackConfig);

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  });

  var hotMiddleware = require('webpack-hot-middleware')(compiler);
// force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({action: 'reload'});
      cb()
    })
  });

// proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {
      options = {target: options}
    }
    app.use(proxyMiddleware(context, options))
  });

// handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
  app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
  app.use(hotMiddleware);

// serve pure static assets
  module.exports = app.listen(PORT, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Listening at http://localhost:' + PORT + '\n')
  });

} else {

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.use(function(req, res, next) {
    // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
    if (!res.headersSent) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }
  });

  // error handlers
  app.use(function(err, req, res, next) { // jshint ignore:line
    var statusCode = err.status || 500;
    if(statusCode === 500) {
      console.error(err.stack || err);
    }
    if(req.timedout) {
      console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
    }
    res.status(statusCode);
    // 默认不输出异常详情
    var error = {};
    if (app.get('env') === 'development') {
      // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
      error = err;
    }
    res.render('error', {
      message: err.message,
      error: error
    });
  });

  app.listen(PORT, function () {
    console.log('Node app is running, port:', PORT);

    // 注册全局未捕获异常处理器
    process.on('uncaughtException', function(err) {
      console.error("Caught exception:", err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
      console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
    });
  });
}

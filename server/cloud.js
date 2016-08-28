/**
 * Created by xiadd on 7/21/16.
 */
var AV = require('leanengine');
var moment = require('moment');
var doubanSpider = require('./spiders/douban/douban');

var Douban = AV.Object.extend('Douban');

function saveObjectsToDatabase(data) {
  console.log('定时任务正在进行');
  if(data instanceof Array === false) {
    console.warn('data应为数组');
    return;
  }
  var query = new AV.Query('Douban');
  data.forEach(function (v) {
    query.contains('title', v.title[0].replace(/\(豆瓣 南京租房豆瓣小组\)/ig, ''));
    query.find().then(function (results) {
      console.log('查询到的'+ v['title'][0]+'结果长度为', results.length);
      if(1) {
        var zufangInfo = new Douban();
        zufangInfo.set('title', v.title[0].replace(/\(豆瓣 南京租房豆瓣小组\)/ig, ''));
        zufangInfo.set('originLink', v.link.toString());
        zufangInfo.set('desc', v['content:encoded'].toString());
        zufangInfo.set('creator', v['dc:creator'].toString());
        zufangInfo.set('pubDate', v['pubDate'].toString());
        zufangInfo.save().then(function () {
          console.log('success');
        }, function (err) {
          console.log('插入错误:',err.message);
        })
      }
    }, function (err) {
      console.error('查询错误:',err.message)
    });
  });
}

AV.Cloud.define('getData', function (request, response) {
  doubanSpider().then(function (data) {
    response.success('success');
    saveObjectsToDatabase(data);
  });
});

//hook函数
AV.Cloud.beforeSave('Douban', function (request, respone) {
  console.log(request.object);
  var query = new AV.Query('Douban');
  var title = request.object.get('title');
  query.contains('title', title);
  query.find().then(function (results) {
    if(results.length === 0) {
      respone.success();
    } else {
      respone.error('数据已存在');
    }
  })
});


module.exports = AV.Cloud;

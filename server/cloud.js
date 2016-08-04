/**
 * Created by xiadd on 7/21/16.
 */
var AV = require('leanengine');
var moment = require('moment');
var doubanSpider = require('./spiders/douban/douban');

var Douban = AV.Object.extend('Douban');

function saveObjectsToDatabase(data) {
  if(data instanceof Array === false) {
    console.warn('data应为数组');
    return;
  }

  var query = new AV.Query('Douban');
  data.forEach(function (v) {
    query.contains('title', v.title[0].replace(/\(豆瓣 南京租房豆瓣小组\)/ig, ''));
    query.find().then(function (results) {
      if(results.length === 0) {
        var zufangInfo = new Douban();
        zufangInfo.set('title', v.title[0].replace(/\(豆瓣 南京租房豆瓣小组\)/ig, ''));
        zufangInfo.set('originLink', v.link.toString());
        zufangInfo.set('desc', v['content:encoded'].toString());
        zufangInfo.set('creator', v['dc:creator'].toString());
        zufangInfo.set('pubDate', moment(v['pubDate'].toString()).locale('zh-cn').format('MMMM Do YYYY, h:mm:ss a'));
        zufangInfo.save().then(function () {
          console.log('success');
        }, function (err) {
          console.log('err:',err.message);
        })
      }
    }, function (err) {
      console.log('find err:',err.message)
    });
  });
}

AV.Cloud.define('getData', function (request, response) {
  doubanSpider().then(function (data) {
    response.success('success');
    saveObjectsToDatabase(data);
  });
});

AV.Cloud.define('test', function (request, response) {
  var test = AV.Object.extend('Test');
  var s = new test();
  s.set('name', '12');
  s.save().then(function () {
    console.log('success');
  });
  response.success('dd')
});


module.exports = AV.Cloud;

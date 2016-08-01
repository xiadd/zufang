/**
 * Created by xiadd on 7/28/16.
 */
var CronJob = require('cron').CronJob;
var AV = require('leanengine');
var doubanSpider = require('../../spiders/douban/douban');

var Douban = AV.Object.extend('Douban');

function saveObjectsToDatabase(data) {
  if(data instanceof Array === false) {
    console.warn('data应为数组');
    return;
  }
  data.forEach(function (v) {
    var zufangInfo = new Douban();
    zufangInfo.set('title', v.title);
    zufangInfo.set('link', v.link);
    zufangInfo.set('description', v.description);
    zufangInfo.set('creator', v['dc:creator']);
    zufangInfo.set('pubDate', v['pubDate']);
    zufangInfo.save().then(function () {
      console.log('success');
    }, function (err) {
      console.log(err.message)
    });
  });
}

function crawDoubanData() {
  new CronJob('* 30 10,18 * * *', function () {
    doubanSpider().then(function (data) {
      saveObjectsToDatabase(data);
    });
  }, null, true, 'Asia/Beijing', null, true);
}

function dealDoubanData(req, res, next) {
  if(!req || !res) {
    console.warn('作为express中间件使用');
    return;
  }
  var query = new AV.Query('Douban');
  query.find().then(function (result) {
    console.log(result);
    res.json(result);
  }, function (err) {
    console.log(err.message);
  })
}

module.exports = dealDoubanData;

/**
 * Created by xiadd on 7/28/16.
 */
var AV = require('leanengine');
var doubanSpider = require('../../spiders/douban/douban');

var Douban = AV.Object.extend('Douban');
var detailInfo = AV.Object.extend('bc' + new Date().toLocaleDateString().split('/').reverse().join('_'));

function saveObjectsToDatabase(data) {
  if(data instanceof Array === false) {
    console.warn('data应为数组');
    return;
  }

  var dateInfo = new Douban();
  var localInfo = data.map(function (v) {
    var zufangInfo = new detailInfo();
    zufangInfo.set('title', v.title);
    zufangInfo.set('link', v.link);
    zufangInfo.set('description', v.description);
    zufangInfo.set('creator', v['dc:creator']);
    zufangInfo.set('pubDate', v['pubDate']);
    return zufangInfo;
  });

  AV.Object.saveAll(localInfo).then(function (cloudInfo) {
    var relation = dateInfo.relation('containedInfo');
    cloudInfo.forEach(function (v) {
      relation.add(v);
    });
    dateInfo.set('date' ,new Date().toLocaleDateString())
    dateInfo.save();
  }, function (err) {
    console.log(err.message)
  })

}

function crawDoubanData() {
  new CronJob('* 30 10,18 * * *', function () {
    doubanSpider().then(function (data) {
      saveObjectsToDatabase(data);
    });
  }, null, true, 'Asia/Shanghai', null, true);
}

function dealDoubanData(req, res, next) {
  if(!req || !res) {
    console.warn('作为express中间件使用');
    return;
  }
  var query = new AV.Query('Douban');
  query.find().then(function (result) {
    return result[0]['attributes']['containedInfo']['targetClassName'];
  }).then(function (data) {
    var $query = new AV.Query(data);
    $query.limit(300);
    return $query.find();
  }).then(function (data) {
    res.json(data)
  })
}

module.exports = dealDoubanData;

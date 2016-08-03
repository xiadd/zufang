/**
 * Created by xiadd on 7/21/16.
 */
var AV = require('leanengine');
var doubanSpider = require('./spiders/douban/douban');

var Douban = AV.Object.extend('Douban');

function saveObjectsToDatabase(data) {
  if(data instanceof Array === false) {
    console.warn('data应为数组');
    return;
  }
  var detailInfo = AV.Object.extend('bc' + new Date().toLocaleDateString().split('/').reverse().join('_'));
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
    dateInfo.set('date', new Date().toLocaleDateString());
    dateInfo.save().then(function () {
      console.log('success');
    }, function (err) {
      console.log(err.message);
    });
  }, function (err) {
    console.log(err.message)
  })

}

AV.Cloud.define('getData', function (request, response) {
  doubanSpider().then(function (data) {
    response.success(data);
    saveObjectsToDatabase(data);
  });
});


module.exports = AV.Cloud;

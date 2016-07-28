/**
 * Created by xiadd on 7/26/16.
 */
var router = require('express').Router();
var doubanData = require('../spiders/douban/douban');
var CronJob = require('cron').CronJob;

router.get('/', function (req, res) {
  new CronJob('* 30 10,18 * * *', function () {
    doubanData().then(function (data) {
      res.json(data);
    }, function (err) {
      console.log(err.message);
    })
  }, null, true, 'Asia/Beijing', null, true);
});

module.exports = router;

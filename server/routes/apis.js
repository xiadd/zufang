/**
 * Created by xiadd on 7/26/16.
 */
var router = require('express').Router();
var doubanData = require('../spiders/douban/douban');
var getDoubanData = require('../components/douban/index');

router.get('/', function (req, res, next) {
  getDoubanData(req, res, next);
});

module.exports = router;

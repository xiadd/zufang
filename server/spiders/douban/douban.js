/**
 * Created by xiadd on 7/25/16.
 */
var API = require('./api');
var request = require('request');
var parseString = require('xml2js').parseString;

var apis = API.groups.map(function (v) {
  return API.baseUrl + v + '/discussion';
});


/**
 *
 * @param data(需要处理的数据)
 * @return {boolean} 返回值[其实没有返回值这里只是阻止函数继续执行]
 */
function dealData( data ) {
  if(!(data instanceof Array)) {

    var err =  new Error('数据类型不对');

    console.log(err.message);

    return false;
  }

}


function getResults() {
  var options = {
    url: apis[0],
    method: 'get',
    headers: {
      'User-Agent': 'Paw/2.3.1 (Macintosh; OS X/10.11.6) GCDHTTPRequest'
    }
  };
  return new Promise(function (resolve, reject) {
    request(options, function (err, res, body) {
      parseString(body, function (error, result) {
        var data = result['rss']['channel'][0]['item'];
        if (typeof data !== 'object') {
          reject(new TypeError('应该返回json数据'));
        } else {
          resolve(data);
        }
      });
    })
  });
}

module.exports = getResults;

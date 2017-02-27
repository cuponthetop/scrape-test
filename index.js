let rq = require('request-promise');
let cheerio = require('cheerio');
let iconv = require('iconv-lite');
let prompt = require('prompt');

var _ = require('lodash');
var charset = require('charset');
var jschardet = require('jschardet');

let req = function rquest(url) {
  var opts = {
    url,
    encoding: null,
    resolveWithFullResponse: true
  };

  return new Promise((resolve, reject) => {
    rq(opts)
      .then((res) => {
        var enc = charset(res.headers, res.body);
        enc = enc || jschardet.detect(res.body).encoding.toLowerCase();
        var ret = iconv.decode(res.body, enc);
        ret = ret.replace(/[\r\n\t]/g, '');
        resolve(ret);
      })
      .catch(reject);
  });
}

let url = process.argv[2];
console.log(`testing scraper for ${url}`);

req(url).then((html) => {
  var $ = cheerio.load(html);

  prompt.start();

  var pr = function () {
    prompt.get([{
      name: 'selector',
      required: true
    }, {
      name: 'q',
      required: false
    }], (err, res) => {
      console.log('looking for ' + res.selector);
      console.log($(res.selector).text());
      if (res.q) {

      } else {
        pr();
      }
    });
  }

  pr();
  // }
});
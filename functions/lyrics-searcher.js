const http = require('http');
const fetch = require('node-fetch');
var querystring = require("querystring");
const iconv = require('iconv-lite');
const { parse } = require('node-html-parser');

let log = console.log;
let warn = console.warn;
let API_KEY;
let CX;

function searchLyrics(param) {

  var songName;
  if (typeof(param) === 'string') {
    songName = param;
  } else if (typeof(param) === 'object') {
    songName = param.songName;
  } else {
    return Promise.reject(new Error('Invalid param: ', param));
  }

  return Promise.resolve().then( ()=> {

    let query = querystring.stringify({
      key: API_KEY,
      cx: CX,
      q: songName
    });

    let url = `https://www.googleapis.com/customsearch/v1?${query}`;

    log('Calling google custom search API: ', url);
    return fetch(url);

  }).then( r => {

    log('Google API returned', r.status);
    return r.json();

  }).then( json => {

    if (json && Array.isArray(json.items) &&
        json.items.length > 0) {

      log('Items found: ', json.items.length);

      return new Promise( (resolve, reject) => {

        let url = new URL(json.items[0].link);

        log('Fetching url: ', url);
        let options = {
          host: url.host,
          path: url.pathname,
          method: 'GET'
        };

        let req = http.request(options, res => {

          let data = '';
          res.on('data', chunk => {
            log('Data received from :', url);
            let decoded = iconv.decode(chunk, 'big-5');
            data += decoded;
          });
          res.on('end', ()=> {
            log('End of data from :', url);
            resolve(data);
          });
          res.on('error', (err) => {
            warn('Error fetch data from: ', url);
            warn(err);
            reject(err);
          });

        });

        req.end();

      });


    } else {

      log('No item found');
      return undefined;
    }

  }).then( html => {

    if (html === undefined) {
      return undefined;
    }

    const root = parse(html, {
      blockTextElements: {
        script: false,
        noscript: false,
        style: false
      }
    });
    if (!root) {
      return undefined;
    }

    const text = root.text;
    if (!text) {
      return undefined;
    }

    let lines = text.split('\n');
    lines = lines
      .map( l => l.trim().trim('\r') );

    let copyright = lines.find( l => l.match(/^版權屬/) )

    lines = lines.filter( l =>
        l.length > 0 &&
        !l.match(/^【.*】/) &&
        !l.match(/^詩集：/) &&
        !l.match(/^版權屬/) &&
        !l.toLowerCase().match(/^<!doctype/) &&
        l !== '\x1A'
      )

    let lyrics = lines.join('\n');

    return { html, lyrics, copyright };

  });

}

module.exports = function(options) {

  options = options || {};
  options.logger = options.logger || console;
  API_KEY = options.apiKey;
  CX = options.cx;

  log = options.logger.log;
  warn = options.logger.warn;

  return {
    search: searchLyrics
  };

}

const functions = require('firebase-functions');
const LyricsSearcher = require('./lyrics-searcher.js');
const logger = require("firebase-functions/lib/logger");
const { key, cx } = functions.config()['google-custom-search'];
const searcher = LyricsSearcher({ apiKey:key, cx, logger });

exports.searchLyrics = functions.https.onCall((param, _context) => {

  logger.log('Cloud function received param: ', param);
  return searcher.search(param);

});

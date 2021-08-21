const LyricsSearcher = require('./functions/lyrics-searcher.js');

let apiKey = 'AIzaSyD82Fj6-PkcMTD3IQ7w1631t5XpBwpNJRY';
let cx = '56005ae38add58681';

let searcher = LyricsSearcher({ apiKey, cx });

searcher.search('你是王').then( data => {

  if (data) {
    console.log(data);
  } else {
    console.log('No lyrics found');
  }

});

var Iconv  = require('iconv').Iconv;

var iconv = new Iconv('UTF-8', 'BIG5');

let buffer = iconv.convert('我向你禱告');

console.log(buffer.toString('hex'));

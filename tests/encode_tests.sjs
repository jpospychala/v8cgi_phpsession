var session = require('../lib/php-session.js');

var enc = session.encode({"key1" : "value1"});
response.write(enc);

var dec = session.decode(enc);
response.write(dec);
for (var k in dec) {
  response.write(k+" "+dec[k]);
}

throw "all pass";
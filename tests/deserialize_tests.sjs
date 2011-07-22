var deserialize = require('../lib/php-serialize.js').deserialize;

function assertEquals(message, expected, actual) {
  if ((expected != null) && (typeof expected == 'object')) {
    if (actual === undefined) {
      throw 'assertEquals failed, actual is undefined, while expected '+expected;
    }
    if (actual.constructor != expected.constructor) {
      throw 'assertEquals failed: ' + message+'. Expected constructor '+expected.constructor+', but was '+actual.constructor;
    }
    for (var k in expected) {
      assertEquals('index '+k+' '+message, expected[k], actual[k]);
    }
  } else if (expected != actual) {
  	throw 'assertEquals failed: ' + message+'. Expected: "'+expected+'" ('+(typeof expected)+'), actual: "'+actual+'" ('+(typeof actual)+')';
  }
}

// basic tests
assertEquals('string', 'hello', deserialize('s:5:"hello";'));
assertEquals('int', 123, deserialize('i:123;'));
assertEquals('null', null, deserialize('N;'));
assertEquals('double', 1.3, deserialize('d:1.3;'));
assertEquals('boolean true', true, deserialize('b:1;'));
assertEquals('boolean false', false, deserialize('b:0;'));
assertEquals('empty array', [], deserialize('a:0:{}'));

// array tests
assertEquals('int array', [1,2,3], deserialize('a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}'));
assertEquals('string array', ["a", "b", "c"], deserialize('a:3:{i:0;s:1:"a";i:1;s:1:"b";i:2;s:1:"c";}'));
assertEquals('array of arrays', [[], []], deserialize('a:2:{i:0;a:0:{}i:1;a:0:{}}'));

// map tests
assertEquals('hashmap', {'apple' : 'fruit', 'orange' : 'color', 'cherry' : 'kiss'}, deserialize('a:3:{s:5:"apple";s:5:"fruit";s:6:"orange";s:5:"color";s:6:"cherry";s:4:"kiss";}'));

// object tests
var ctx1 = { SampleObject : function() {}};
var out = deserialize('O:12:"SampleObject":0:{}', ctx1);
assertEquals('sampleObject', new ctx1.SampleObject(), out);
assertEquals('sampleObject', 'SampleObject', out.constructor.name);

// stuffed constructor
var ctx2 = { Address : function() {}};
var address = deserialize('O:7:"Address":6:{s:6:"street";s:10:"Strzelecka";s:5:"house";i:10;s:4:"room";i:1;s:7:"zipcode";s:6:"62-256";s:4:"city";s:6:"Poznan";s:7:"country";s:6:"Poland";}', ctx2);
assertEquals('sampleObject', 'Address', address.constructor.name);
assertEquals('address object', 'Strzelecka', address.street);
assertEquals('address object', 10, address.house);
assertEquals('address object', 1, address.room);
assertEquals('address object', '62-256', address.zipcode);
assertEquals('address object', 'Poznan', address.city);
assertEquals('address object', 'Poland', address.country);

// happy end
throw 'all passed';
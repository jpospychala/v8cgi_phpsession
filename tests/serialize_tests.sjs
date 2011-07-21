var serialize = require('../lib/php-serialize.js').serialize;

function assertEquals(message, expected, actual) {
  if (expected != actual) {
  	throw 'assertEquals failed: ' + message+'. Expected: "'+expected+'", actual: "'+actual+'"';
  }
}

// basic tests
assertEquals('string', 's:5:"hello";', serialize('hello'));
assertEquals('int', 'i:123;', serialize(123));
assertEquals('null', 'N;', serialize(null));
assertEquals('double', 'd:1.3;', serialize(1.3));
assertEquals('boolean true', 'b:1;', serialize(true));
assertEquals('boolean false', 'b:0;', serialize(false));
assertEquals('empty array', 'a:0:{}', serialize([]));

// array tests
assertEquals('int array', 'a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}', serialize([1,2,3]));
assertEquals('string array', 'a:3:{i:0;s:1:"a";i:1;s:1:"b";i:2;s:1:"c";}', serialize(["a", "b", "c"]));
assertEquals('array of arrays', 'a:2:{i:0;a:0:{}i:1;a:0:{}}', serialize([[], []]));

// map tests
assertEquals('hashmap', 'a:3:{s:5:"apple";s:5:"fruit";s:6:"orange";s:5:"color";s:6:"cherry";s:4:"kiss";}', serialize({'apple' : 'fruit', 'orange' : 'color', 'cherry' : 'kiss'}));

// object tests
// empty constructor
function SampleObject() {
}
assertEquals('true', 'O:12:"SampleObject":0:{}', serialize(new SampleObject()));

// stuffed constructor
function Address(street, house, room, zipcode, city, country) {
  this.street = street;
  this.house = house;
  this.room = room;
  this.zipcode = zipcode;
  this.city = city;
  this.country = country;
}
assertEquals('address object', 'O:7:"Address":6:{s:6:"street";s:10:"Strzelecka";s:5:"house";i:10;s:4:"room";i:1;s:7:"zipcode";s:6:"62-256";s:4:"city";s:6:"Poznan";s:7:"country";s:6:"Poland";}', serialize(new Address("Strzelecka", 10, 1, '62-256', 'Poznan', 'Poland')));


// happy end
throw 'all passed';
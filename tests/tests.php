<?php

function test($msg) {
  echo ' '.serialize($msg).'<br/>';
}



test('hello');
test('hello "doctor" johnes');
test(123);
test(null);
test(1.3);
test(true);
test(false);
test(array());
test(array(1,2,3));
test(array("a", "b", "c"));
test(array(array(), array()));
test(array(array(), array()));
test(array("apple"=>"fruit","orange"=>"color","cherry"=>"kiss"));

class SampleObject {
}
test(new SampleObject());

class Address {
  var $street;
  var $house;
  var $room;
  var $zipcode;
  var $city;
  var $country;
  
  function __construct($aStreet, $aHouse, $aRoom, $aZipCode, $aCity, $aCountry) {
    $this->street = $aStreet;
    $this->house = $aHouse;
    $this->room = $aRoom;
    $this->zipcode = $aZipCode;
    $this->city = $aCity;
    $this->country = $aCountry;
  }
}
test(new Address("Strzelecka", 10, 1, "62-256", "Poznan", "Poland"));

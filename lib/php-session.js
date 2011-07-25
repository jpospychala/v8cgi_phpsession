/**
 * Poor man's reading/writing of PHP session file. Reads ints and strings, but fails on objects and arrays.
 * 
 */
var fs = require('fs');
var serializer = require('./php-serialize.js');

exports.session_file_path = '/private/var/tmp/';

var getSessionStr = function(id) {
	var filePath = exports.session_file_path + 'sess_' + id;
	
	var f = new fs.File(filePath);
	var fStat = f.stat();
	
	f.open('r');
	var sessStr = f.read(fStat.size).toString("UTF-8");
	f.close();
	
	return sessStr;
} 

var saveSessionStr = function(id, data) {
	var filePath = exports.session_file_path + 'sess_' + id;
	
	var f = new fs.File(filePath);
	f.open('w');
	var sessStr = f.write(data);
	f.close();
}

/**
 * Encodes session object to string value.
 * 
 * @param object session object to encode
 * @returns encoded string
 */
var encode = function(object) {
	var data = '';
	for (var key in object) {
		data += key + '|';
		
		var value = object[key];
		data += serializer.serialize(value);
	}
	
	return data;
}

/**
 * Decodes session object from encoded session string value.
 * 
 * @param value encoded session string
 * @returns session object
 */
var decode = function(value) {
	var newSession = {};
	
	var data = { offset : 0};
	var idx = value.indexOf('|', data.offset);
	while (idx > -1) {
		var key = value.substring(data.offset, idx);
		data.offset = idx + 1; // skip by 1 to eat '|'
		var val = serializer.deserialize(value, data);
		
		newSession[key] = val;
		
		idx = value.indexOf('|', data.offset);
	}
	
	return newSession;
}

/**
 * Gets session from PHP
 */
var session_start = function () {
	var sessionStr = getSessionStr(request.cookie['PHPSESSID']);
	exports.session = decode(sessionStr);
}

var session_end = function () {
	var data = encode(exports.session); 
	saveSessionStr(request.cookie['PHPSESSID'], data);
}

/**
 * CommonJS exports
 */
exports.session_start = session_start;
exports.session_end = session_end;
exports.encode = encode;
exports.decode = decode;
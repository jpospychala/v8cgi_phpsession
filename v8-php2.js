/**
 * Poor man's reading/writing of PHP session file. Reads ints and strings, but fails on objects and arrays.
 * 
 */
var fs = require('fs');

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
 * Gets session from PHP
 */
exports.session_start = function () {
	var sessStr = getSessionStr(request.cookie['PHPSESSID']);
	
	var entries = sessStr.split(';');
	var newSession = {};
	for (var a in entries) {
		var entry = entries[a].split('|');
		var key = entry[0];
		var value = entry[1];
		if (value) {
			switch (value[0]) {
			  case ('s') : 
				  // s:length:<string>
				  // s:length:"<quoted string>"
				  var strValue = value.split(':')[2];
			  		if (strValue[0] === '"') {
			  			strValue = strValue.substr(1, strValue.length - 2);
			  		}
				newSession[key]= strValue; 
			  break;
			  case ('i') :  // i:<number>
				  newSession[key] = parseInt(value.substr(2));
			  break;
			  case ('c') : 
				  newSession[key] = 'class'; 
			  break;
			  case ('a') : 
				  newSession[key] = 'array'; 
			  break;
			}
		}
	}

	exports.session = newSession;
}

exports.session_end = function () {
	var isNext = false;
	var data = '';
	for (var key in exports.session) {
		data += key + '|';
		
		var value = exports.session[key];
		var keyType = typeof value;
		switch (keyType) {
		case ('string') :
			if (/ /.test(value)) {
				value = '"'+value+'"';
			}
			data += 's:' + value.length + ':' + value;
			break;
		case ('number') :
			data += 'i:' + value;
			break;
		default :
			throw keyType + ' unsupported'; 
			break;
		}
		data += ';';
	}
	saveSessionStr(request.cookie['PHPSESSID'], data);
}

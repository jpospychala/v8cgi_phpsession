/**
 * Serializes value using PHP serialize() format
 * 
 * @param value any value
 * @returns string
 */
var serialize = function (value) {
	if (value === null) {
		return 'N;';
	}
	
	var keyType = typeof value;
	
	switch (keyType) {
	case ('string') :
		return 's:' + value.length + ':"' + value + '";';
	
	case ('number') :
		return (value % 1 == 0) ? ('i:' + value + ';') : ('d:' + value + ';');
	
	case ('object') :
		if (value.constructor == Array) {
			var result = 'a:'+value.length+':{';
			for (var i = 0; i < value.length; i++) {
				result += serialize(i) + serialize(value[i]);
			}
			return result + '}';
			 
		} else {
			var head = '';
			if (value.constructor == Object) {
				head += 'a:';
			} else {
				var objName = value.constructor;
				head += 'O:'+objName.name.length+':"'+objName.name+'":';
			}
			
			var body = '';
			var i = 0;
			for (var key in value) {
				body += serialize(key) + serialize(value[key]);
				i++;
			}
			
			return head + i+':{'+body+'}';
		}
	
	case ('boolean') :
		return 'b:'+(value ? '1' : '0')+';';
		
	default :
		throw keyType + ' unsupported'; 
		break;
	}
};

/**
 * Deserializes PHP serialized string into a JavaScript object
 * 
 * @param value String with serialized data
 * @param ctx Context object with constructors to build objects. If this parameter is missing, 
 * @param data
 * @returns
 */
var deserialize = function(value, data) {
	data = data || { offset : 0};
	//response.write('deserialize '+value+' from '+data.offset+'   // '+value.substr(data.offset, 8)+'...<br/>');
	
	var type = value[data.offset++];
	data.offset++; // move by 1 to skip colon (s/i/d/b/a/O) or semicolon (N)
	
	if (type === 'N') { // null
		return null;
	}
	
	if (type == 'i' || type == 'b' || type == 'd') { // integer/boolean/double
		var semicolon = value.indexOf(';', data.offset);
		var obj = value.substring(data.offset, semicolon);
		data.offset = semicolon + 1; // move by 1 to skip semicolon
		
		switch (type) {
		case 'i': // integer
			return parseInt(obj);
		
		case 'd': // double
			return parseFloat(obj);
			
		case 'b': // boolean
			return obj === '1' ? true : false;
		}
	}
	
	var colon = value.indexOf(':', data.offset);
	var obj = value.substring(data.offset, colon);
	var objLen = parseInt(obj);
	data.offset = colon + 1; // move by 1 to skip colon
	
	switch (type) {
	case 's': // string
		data.offset++; // move by 1 to skip starting quote
		var obj2 = value.substr(data.offset, objLen);
		data.offset += objLen + 2; // move by 2 to skip ending quote and semicolon
		return obj2;
		
	case 'a': // array
		data.offset++ // move by 1 to skip starting '{'
		var array = [];
		var isArray = true;
		for (var i = 0; i < objLen; i++) {
			var key = deserialize(value, data);
			if (isArray && (parseInt(key) != i)) { // on first invalid index, turn array to object
				isArray = false;
				array.constructor = Object;
			}
			var keyValue = deserialize(value, data);
			array[key] = keyValue;
		}
		data.offset++; // move by 1 to skip ending '}'
		return array;
		
	case 'O': // object
		data.offset++ // move by 1 to skip starting quote
		var objName = value.substr(data.offset, objLen);
		data.offset += objLen + 2; // move by 2 to skip ending quote and colon

		colon = value.indexOf(':', data.offset);
		obj = value.substring(data.offset, colon);
		objLen = parseInt(obj);
		data.offset++ // move by 2 to skip starting ':{'
		
		var object = {};
		try {
			if (data[objName]) {
				object = new data[objName]();
			}
		} catch (ex) {
			// silently eat constructor error
		}
		for (var i = 0; i < objLen; i++) {
			var key = deserialize(value, data);
			var keyValue = deserialize(value, data);
			object[key] = keyValue;
		}
		data.offset++; // move by 1 to skip ending '}'
		return object;
	}
}

// commonJS module exports;
var exports = exports || {};
exports.serialize = serialize;
exports.deserialize = deserialize;

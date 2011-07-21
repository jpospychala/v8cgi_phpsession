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
 * TODO
 * 
 * @param value
 * @returns
 */
var deserialize = function(value) {
	// TODO
	return null;
}

exports.serialize = serialize;
exports.deserialize = deserialize;
/*
 * Sample JS client with READ/WRITE access to PHP session
 */

var phpSession = require('../lib/php-session.js');

phpSession.session_start();

response.write(HTML.dump(phpSession.session));


phpSession.session.products++;

phpSession.session_end();



"use strict"
var open = require('open')
  , http = require('http')
  , url = require('url')
  , querystring = require('querystring')

module.exports = function (requestUrl, timeout, port, callback) {
	var t
	  , end = function (error, code) {
			clearTimeout(t)
			server.close()
			callback(error, code)
		};
	var server = http.createServer(function (req, res) {
		var query = querystring.parse(url.parse(req.url).query)
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/html; charset=UTF-8')
		res.write('Thanks, you can close this window now!')
		res.end()
		if (query.error) {
			end({
				type: 'from_google',
				error: error
			})
		} else if (query.code) {
			end(null, query.code)
		}
	})
	server.listen(port)
	t = setTimeout(end.bind(null, {type: 'timeout'}), timeout)
	open(requestUrl)
}
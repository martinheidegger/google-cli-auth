"use strict";

var openAndWait = require('./openAndWait')
  , request = require('request')

module.exports = function requestPermission(options, port, callback) {
	var url = 'https://accounts.google.com/o/oauth2/auth'
					+ '?redirect_uri=' + encodeURIComponent(options.return_uri)
					+ '&response_type=code'
					+ '&client_id=' + encodeURIComponent(options.client_id)
					+ '&scope=' + options.scope.map(function(scope) { return encodeURIComponent(scope) }).join(',')
					+ '&access_type=offline'
	openAndWait(url, options.timeout, port, function (err, code) {
		if (err) 
			return callback(err)
		request.post('https://www.googleapis.com/oauth2/v3/token', {
			form: {
				  client_id: options.client_id
				, client_secret: options.client_secret
				, redirect_uri: options.return_uri
				, grant_type: "authorization_code"
				, code: code
			},
			json: true
		}, function (error, response, body) {
			if (error)
				return callback({
					  type: 'google-auth-http'
					, error: error
				})

			if (body.error)
				return callback({
					  type: 'google-auth-fail'
					, error: body.error
				})

			callback(null, body)
		})
	})	
}
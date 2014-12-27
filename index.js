"use strict";
var joi = require("joi")
  , EventEmitter = require("events").EventEmitter
  , loadStoredToken = require("./lib/loadStoredToken")
  , requestPermission = require("./lib/requestPermission")
  , refreshTokenFactory = require("./lib/refreshTokenFactory")
  , saveTokenFactory = require("./lib/saveTokenFactory")
  , userDir = require("./lib/userDir")
  , path = require('path')

function emitCheck(emitter) {
	return function emit(event) {
		if (EventEmitter.listenerCount(emitter, event) > 0) {
			emitter.apply(emitter, [].concat(arguments))
			return true
		}
		return false
	}
}
function zalgoFallback() {
	console.log("Zalgo fallback is necessary!", new Error().stack)
}

module.exports = function (options, callback) {
	var emitter = new EventEmitter()
	  , emit = emitter.emitCheck = emitCheck(emitter)
	function end(error, token) {
		if (error)
			emit("error", error) || console.log("Error during authentication: " + JSON.stringify(error))

		if (token)
			emit("token", token)
		
		callback && callback(error, token)
		callback = zalgoFallback
	}
	joi.validate(options, {
  		  dir: joi.string()
  		, name: joi.string().required()
  		, client_secret: joi.string()
  		, client_id: joi.string()
  		, port_from: joi.number().integer().min(1000).default(40000)
  		, port_to: joi.number().integer().min(1000).default(50000)
  		, access_type: "offline"
  		, timeout: joi.number().integer().min(1000).default(1000 * 60 * 60 * 20) // 20 minute default
  		, scope: joi.array().includes(joi.string()).min(1).required()
  		, auto_refresh: joi.boolean().default(true)
  	}, function (error, options) {
		if (error) return end(error)

		var port = options.port_from + ((options.port_from - options.port_to) * Math.random() | 0)
		options.access_type = "offline"
		options.path = path.join(userDir('.config', options.name), 'token.json')
		options.return_uri = "http://localhost:" + port

		emit('loading-token', options.path) || console.log('Loading token from ' + options.path)
		loadStoredToken(options, function (error, token) {
			if (error) return end(error)

			function prepareToken(token) {
				token.refresh = refreshTokenFactory(options, emitter)
				token.save = saveTokenFactory(options, emitter)
				return token
			}

			if (!token) {
				emit("wait-for-user") || console.log("Waiting for user")
				return requestPermission(options, port, function (error, token) {
					if (error) return end(error)

					token.creation = Date.now()
					token.refreshed = token.creation
					token.expires_at = token.refreshed + (token.expires_in * 1000)
					prepareToken(token).save(end)
				})
			}

			token = prepareToken(token)

			if (token.expires_at < Date.now())
				return token.refresh(end)

			end(null, prepareToken(token))
		})
	})
	return emitter
};
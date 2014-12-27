"use strict";

var fs = require('fs')

module.exports = function loadStoredToken(options, callback) {
	fs.exists(options.path, function (exists) {
		if (!exists)
			return callback(null, null)
		fs.readFile(options.path, "utf8", function (error, data) {
			if (error)
				return callback({
					  type: "config-access-error"
					, error: error
					, path: options.path
				})

			try {
				data = JSON.parse(data)
			} catch(e) {
				return callback({
					  type: "config-parse-error"
					, error: e
					, path: options.path
				})
			}
			callback(null, data)
		})
	})
}
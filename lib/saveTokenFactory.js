
var fs = require('fs')

module.exports = function saveTokenFactory(options, emitter) {
	return function saveToken(callback) {
		var token = this
		emitter.emitCheck('save') || console.log("Saving token at " + options.path)
		fs.writeFile(options.path, JSON.stringify({
			  access_token: token.access_token
			, token_type: token.token_type
			, refresh_token: token.refresh_token
			, creation: token.creation
			, refreshed: token.refreshed
			, expires_at: token.expires_at
		}), function (error) {
			if (error)
				return callback({
					  type: "config-write-error"
					, error: error
					, path: options.path
				})

			callback(null, token)
		})
	}
}
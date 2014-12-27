
var request = require('request')

module.exports = function refreshTokenFactory(options, emitter) {
	return function (callback) {
		var token = this
		emitter.emitCheck('refresh') || console.log("Refreshing token")
		request.post('https://www.googleapis.com/oauth2/v3/token', {
			form: {
				  refresh_token: this.refresh_token
				, client_id: options.client_id
				, client_secret: options.client_secret
				, grant_type: 'refresh_token'
			},
			json: true
		}, function (error, response, data) {
			if (error)
			    return callback(error)
			
			token.access_token = data.access_token
			token.expires_in = data.expires_in
			token.refreshed = Date.now()
			token.expires_at = token.refreshed + data.expires_in * 1000
			token.token_type = data.token_type
			token.save(callback)
		})
	}
}
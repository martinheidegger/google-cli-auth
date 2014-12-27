# google-cli-auth

Command line helper tool to work with Google access tokens.

## What?
To use the API of Google any code will need to [authenticate](https://developers.google.com/+/api/oauth). This tool helps you to build a command line tool that uses the Google API.

## Setup
1) To use the module you need to install it.

```bash
$ npm i google-cli-auth --save
```

2) You need get create a project in the [Google Developers Console](https://cloud.google.com/console)

3) In the developers console (under `APIs & auth`) choose `Credentials`.

4) (Under "OAuth") choose `Create new client ID`

5) Choose `Installed Application` and `Other`

6) Then you can setup your code with the `CLIENT ID` and `CLIENT SECRET` like this:

```JavaScript
require('google-cli-auth')({
      name: 'my-app' // will be used to store the token under ~/.config/my-app/token.json
    , client_id: '...' // enter client id from the developer console
    , client_secret: '...' // enter client secret from the developer console
    , scope: [] // add scopes 
}, function (error, token) {
    token.access_token // your token 
    token.token_type // token type
    token.expires_at // timestamp when this token will be expired
    token.refresh(callback) // Refreshes the token
})
```

Note: There is more information about Scopes in the [google developer docs](https://developers.google.com/+/api/oauth#scopes).

## Differentiation
There is [another cli tool](https://github.com/villadora/google-auth-cli) that does cli authentication. This tool is different in the sense that the token that you will get will be stored/retreived from the users config folder and offers methods to refresh the token.

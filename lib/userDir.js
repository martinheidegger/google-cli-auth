"use strict";
var path = require('path')
  , mkdirp = require("mkdirp")

// From https://github.com/rvagg/workshopper 
module.exports = function userDir () {
  var folders = [process.env.HOME || process.env.USERPROFILE].concat(Array.prototype.slice.apply(arguments))
  var dir = path.join.apply(path, folders)
  mkdirp.sync(dir)
  return dir
}
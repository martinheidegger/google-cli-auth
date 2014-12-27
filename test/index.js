"use strict";

var Lab = require("lab"),
    code = require("code"),
    lab = Lab.script(),
    expect = code.expect,
    describe = lab.describe,
    it = lab.it,
    gca = require("../");

describe("default usage", function () {
    it("should offer a login in the browser if not given", {timeout: 30000}, function (done) {
    	gca({
    		  name: "auth-test"
    		, scope: ["https://spreadsheets.google.com/feeds/"]
    	}, done);
    });
});	

exports.lab = lab;
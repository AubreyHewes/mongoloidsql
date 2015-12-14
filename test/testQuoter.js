/*global describe, it*/
"use strict";

var assert = require("assert");
var quoter = require("../src/quoter.js");

describe("quoter.js", function() {

  it("should return escaped value", function () {
    assert.equal('"te\\\'st"', quoter.value("te'st"));
    assert.equal('"te\\"st"', quoter.value("te\"st"));
  });

  it("should return escaped column", function () {
    assert.equal('`te\\\'st`', quoter.column("te'st"));
    assert.equal('`te\\"st`', quoter.column("te\"st"));
  });

});

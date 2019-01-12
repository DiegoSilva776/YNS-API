/**
 * This file aims to test the most useful utility classes
 * 
 * About de dependencies
 * Mocha - Describe, run and build tests
 * Chi - Check values within the test
 */

const expect = require("chai").expect;
const responseUtils = require("../utils/ResponseUtils");

describe("Utils", function() {

    describe("getResponse", function() {

        it("should get valid response object with the data attribute being the default value\n", function() {
            const responseMsg = "Valid response with the default value";
            var results = responseUtils.getResponse(true, responseMsg, null, -1);

            expect(results.status).to.equal(true);
            expect(results.msg).to.equal(responseMsg);
            expect(results.data).to.equal(-1);
        });
    });

});
/**
 * Provides functions that encapsulate the validation of variables used across the server.
 */

const { validationResult } = require('express-validator/check');

module.exports = {

    STATUS_SUCCESS: 200,
    STATUS_REDIRECT: 300,
    STATUS_FAILED_INPUT: 422,
    STATUS_ERROR: 500,

    isValidList : function(list) {

        if (module.exports.isValidVal(list)) {

            if (list.length > 0) {
                return true;
            }
        }

        return false;
    },

    isValidVal : function(rawVal) {

        if (typeof rawVal !== 'undefined' && rawVal !== undefined && rawVal !== null) {
            return true;
        } else {
            return false;
        }
    },

    cleanObj : function(obj) {

        for (var propName in obj) { 

            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
    },

    hasErrors: function(req, res) {
        errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ 
                errors: errors.array() 
            });
        } else {
            return false;
        }
    }

}
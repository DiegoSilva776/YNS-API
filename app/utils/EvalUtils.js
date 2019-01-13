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

    /**
     * cleanObj
     * 
     * Warning: Changes on the escaping and unescaping methods can lead to problems on database queries, 
     * because the searched performed by the persistence layer consider the escaped values 
     * that are stored in the Firebase database.
     */
    cleanObj : function(obj) {

        if (module.exports.isValidVal(obj)) {

            // Remove undefined values
            if (Object.keys(obj).length > 1) {

                for (var propName in obj) { 

                    if (obj[propName] === null || obj[propName] === undefined) {
                        delete obj[propName];
                    }
                }
            }

            // Remove special characters if the object and the inner objects are of type String
            if (typeof(obj) === "string") {
                obj = escape(obj);

            } else if (typeof(obj) === "object") {
                var keys = Object.keys(obj);

                for (var i = 0; i < keys.length; i++) {
                    var innerObj = obj[keys[i]];
                    obj[keys[i]] = module.exports.cleanObj(innerObj);
                }
            }
        }

        return obj;
    },

    /**
     * unescapeObj
     * 
     * Warning: Changes on the escaping and unescaping methods can lead to problems on database queries, 
     * because the searched performed by the persistence layer consider the escaped values 
     * that are stored in the Firebase database.
     */
    unescapeObj: function(obj) {

        if (module.exports.isValidVal(obj)) {
            
            if (typeof(obj) === "string") {
                obj = unescape(obj);

            } else if (typeof(obj) === "object") {
                var keys = Object.keys(obj);

                for (var i = 0; i < keys.length; i++) {
                    var innerObj = obj[keys[i]];
                    obj[keys[i]] = module.exports.unescapeObj(innerObj);
                }
            }
        }

        return obj;
    },

    hasErrors: function(req) {
        errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errors.array();
        } else {
            return false;
        }
    }

}
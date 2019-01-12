/**
 * Provides functions that encapsulate the validation of variables used across the server.
 */

module.exports = {

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
    }

}
/**
 * Provides methods related to a date and time, usually timestamps used in log files 
 * and on the database.
 */

var TAG = "DateTimeUtils";
var MSG_FAILED_BUILD_RESPONSE = "Failed to build a valid response";

var logUtils = require('./LogUtils.js');
var evalUtils = require('./EvalUtils.js');

module.exports = {

    getResponse : function(status, msg, data, defaultValue) {
        var response = {
            "status" : false,
            "msg" : "",
            "data" : {}
        };

        try {

            if (evalUtils.isValidVal(status)) {
                response.status = status;
            }

            if (evalUtils.isValidVal(msg)) {
                response.msg = msg;
            }

            if (evalUtils.isValidVal(data)) {
                response.data = data;

            } else if (evalUtils.isValidVal(defaultValue)) {
                response.data = defaultValue;

            } else {
                response.data = "";
            }

        } catch (err) {
            logUtils.logMessage(TAG, MSG_FAILED_BUILD_RESPONSE);
        }
    
        return response;
    }

}
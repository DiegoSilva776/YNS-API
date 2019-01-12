/**
 * LogUtils
 * 
 * Outputs information in a centralized and standarized way.
 */

var TAG = "LogUtils";

var dtUtils = require('./DateTimeUtils.js');

module.exports = {

    IS_LOG_OPS_ENABLED : true,

    logMessage : function(tag, rawMsg) {
        var msg = "";

        try {

            if (module.exports.IS_LOG_OPS_ENABLED) {
                msg = dtUtils.getNowTimeStamp() + ": " + tag + " " + rawMsg;

                console.log(msg);
            }

        } catch (err) {

            if (module.exports.IS_LOG_OPS_ENABLED) {
                console.error(TAG + err);
            }
        }
    },

    getLogMessage : function(tag, rawMsg) {
        var msg = "";

        try {
            msg = dtUtils.getNowTimeStamp() + ": " + tag + " " + rawMsg;

        } catch (err) {

            if (module.exports.IS_LOG_OPS_ENABLED) {
                console.error(TAG + err);
            }
        }

        return msg;
    }

};
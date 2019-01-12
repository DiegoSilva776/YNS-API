/**
 * Provides methods related to a date and time, usually timestamps used in log files 
 * and on the database.
 */

var TAG = "DateTimeUtils";
var MSG_FAILED_GET_TIMESTAMP = "Failed to get timestamp";

var logUtils = require('./LogUtils.js');

module.exports = {

    getNowTimeStamp : function() {
        var utc_timestamp = "";

        try {
            var now = new Date;
            utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() , 
                                         now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), 
                                         now.getUTCMilliseconds());   
        } catch (err) {
            logUtils.logMessage(TAG, MSG_FAILED_GET_TIMESTAMP);
        }
    
        return utc_timestamp;
    }

}
/**
 * The methods within this model provide a way to interact with local folders
 */

var TAG = "PathUtils";
var MSG_FAILED_GET_PATH_STATIC_FILES = "Failed to return the path to the folder that contains the static files";

var path = require("path");
var logUtils = require('./LogUtils');

module.exports = {

    Local : {

        appRoot     : '.',
        STATIC_PATH : '/data/',
        TEMP_DIR    : '_tmp/'

    },

    getPathStaticFiles : function() {
        var pathStaticFiles = "";

        try {
            pathStaticFiles = path.join(this.Local.appRoot, this.Local.STATIC_PATH)

        } catch(err) {
            logUtils.logMessage(TAG, MSG_FAILED_GET_PATH_STATIC_FILES)
        }

        return pathStaticFiles;
    }

}
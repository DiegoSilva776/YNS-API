/**
 * This module provides methods that facilitate the communication with the database.
 */

const TAG = "DbUtils";

const MSG_FAILED_OPEN_NEW_CONNECT_TO_MONGO = "Failed to open a new connection to MongoDB. ";

var mongoose = require('mongoose');

var env = require('./EnvUtils');
var logUtils = require('./LogUtils');
var evalUtils = require('./EvalUtils');

module.exports = {

    /**
     * Verify the state of the default connection and start a new one if necessary.
     */
    connectToFirebaseDB: function() {
        var success = true;
        
        try {
            /*
            const connString = `mongodb://${env.vars.DB_IP}:${env.vars.DB_PORT}/${env.vars.DB_NAME}`;
            const connOptions = { 
                bufferCommands: false,
                useNewUrlParser: true,
                keepAlive: false,
                poolSize: 30,
                connectTimeoutMS: 10000, 
                bufferMaxEntries: 0,
                reconnectTries: 30
            };

            if (MONGOOSE_CONN_STATE_DISCONNECTED === mongoose.connection.readyState) {
                mongoose.connect(connString, connOptions, function () {}).catch(function(){});
                logUtils.logMessage(TAG, MSG_CONNECTING_MONGOOSE);
            }
            */

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_OPEN_NEW_CONNECT_TO_MONGO} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_OPEN_NEW_CONNECT_TO_MONGO);
            }
            
            success = false;
        }

        return success;
    },

    isConnected: function() {
        try {
            
            /*
            if (MONGOOSE_CONN_STATE_CONNECTED === mongoose.connection.readyState) {
                return true;
            } else {
                return false;
            }
            */

        } catch (err) {
            return false;
        }
    }

}
/**
 * This module provides methods that facilitate the communication with the database.
 */

const TAG = "DbUtils";

const MSG_FAILED_OPEN_NEW_CONNECT_TO_FIREBASE = "Failed while connecting to Firebase. ";

var firebaseAdmin = require("firebase-admin");

var env = require('./EnvUtils');
var logUtils = require('./LogUtils');
var evalUtils = require('./EvalUtils');

var isConnectedFirebase = false;

module.exports = {

    /**
     * Connects the API to Firebase and its services
     */
    connectToFirebaseDB: function() {
        var success = true;
        
        try {
            var serviceAccount = require(env.vars.FIREBASE_CRED_PATH);

            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount),
                databaseURL: env.vars.FIREBASE_PROJ_URL
            });

            isConnectedFirebase = true;

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_OPEN_NEW_CONNECT_TO_FIREBASE} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_OPEN_NEW_CONNECT_TO_FIREBASE);
            }
            
            success = false;
            isConnectedFirebase = false;
        }

        return success;
    },

    isConnected: function() {
        return isConnectedFirebase;
    }

}
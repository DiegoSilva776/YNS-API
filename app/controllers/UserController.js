/**
 * Perform the Upsert, Find and Delete actions on objects of the class User
 */

const TAG = "UserController";
const MSG_FAILED_SAVE_USER_DB = "Failed to save User";
const MSG_CREATED_USER_DB = "Created User";
const MSG_FAILED_CREATE_USER_DB = "Failed to create User";
const MSG_UPDATED_USER_DB = "Updated User";
const MSG_FAILED_UPDATE_USER_DB = "Failed to update User";
const MSG_GOT_USER_DB = "Found User with the given input parameters";
const MSG_FAILED_GET_USER_DB = "Failed to find User with the given input parameters";
const MSG_GOT_USERS_DB = "Found Users with the given input parameters";
const MSG_FAILED_GET_USERS_DB = "Failed to find Users with the given input parameters";
const MSG_DELETED_USER_DB = "Delete User with the given input parameters";
const MSG_FAILED_DELETE_USER_DB = "Failed to delete User with the given input parameters";

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

const User = require('../models/User.js').model;

module.exports = {

    findUser : function (email, callback) {
        try {
            var resUser = null;

            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true, resUser);
                }
            }

            var handleError = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(false, null);
                }
            }

            if (evalUtils.isValidVal(email)) {
                var query = { 
                    'email': email
                };

                /*
                User.findOne(query, function(err, userDB) {
                    resUser = userDB;
    
                    if (!err && evalUtils.isValidVal(resUser)) {
                        logUtils.logMessage(TAG, `${MSG_GOT_USER_DB}`);
                        handleSuccess();
                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB} ${err}`);
                        handleError();   
                    }
                });
                */
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_GET_USER_DB);
            }
            
            handleError();
        }
    },

    upsertUser : function (email, name, profilePic, latestViewedNotification, callback) {

        try {
            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true);
                }
            }

            var handleError = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(false);
                }
            }

            if (evalUtils.isValidVal(name) &&
                evalUtils.isValidVal(profilePic) &&
                evalUtils.isValidVal(email) &&
                evalUtils.isValidVal(latestViewedNotification)) {

                // Verify if a User with the given email already exist
                var query = { 
                    'email': email
                };
                var update = {
                    name: name, 
                    profilePic: profilePic, 
                    email: email,
                    latestViewedNotification: latestViewedNotification,
                    updatedAt: new Date().toISOString()
                };

                // Try to update
                /*
                User.findOneAndUpdate(query, update, {}, function (err, user) {

                    if (!err && !evalUtils.isValidVal(user)) {
                        // Create a new User
                        var user = new User({
                            name: name, 
                            profilePic: profilePic, 
                            email: email,
                            latestViewedNotification: latestViewedNotification,
                            createdAt : new Date().toISOString(),
                            updatedAt : new Date().toISOString()
                        });

                        user.save(function(err) {

                            if (!err) {
                                logUtils.logMessage(TAG, `${MSG_CREATED_USER_DB}`);
                                handleSuccess();
                            } else {
                                logUtils.logMessage(TAG, `${MSG_FAILED_CREATE_USER_DB} ${err}`);
                                handleError();    
                            }
                        });

                    } else if (!err) {
                        logUtils.logMessage(TAG, `${MSG_UPDATED_USER_DB}`);
                        handleSuccess();

                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_UPDATE_USER_DB} ${err}`);
                        handleError();
                    }
                });
                */

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_SAVE_USER_DB);
            }
                
            handleError();
        }
    },

    deleteUser : function (email, callback) {
        try {
            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true);
                }
            }

            var handleError = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(false);
                }
            }

            if (evalUtils.isValidVal(email)) {
                var query = { 
                    'email': email
                };

                /*
                User.findOneAndRemove(query, function(err) {

                    if (!err) {
                        logUtils.logMessage(TAG, `${MSG_DELETED_USER_DB}`);
                        handleSuccess();
                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB} ${err}`);
                        handleError();   
                    }
                });
                */

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_DELETE_USER_DB);
            }
            
            handleError();
        }
    }

}
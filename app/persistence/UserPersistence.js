/**
 * Perform the Upsert, Find and Delete actions on objects of the class User
 */

const TAG = "UserPersistence";
const MSG_FAILED_SAVE_USER_DB = "Failed to save User";
const MSG_CREATED_USER_DB = "Created User";
const MSG_UPDATED_USER_DB = "Updated User";
const MSG_FAILED_UPDATE_USER_DB = "Failed to update User";
const MSG_GOT_USER_DB = "Found User with the given input parameters";
const MSG_FAILED_GET_USER_DB = "Failed to find User with the given input parameters";
const MSG_GOT_USERS_DB = "Found Users with the given input parameters";
const MSG_FAILED_GET_USERS_DB = "Failed to find Users with the given input parameters";
const MSG_DELETED_USER_DB = "Deleted User with the given input parameters";
const MSG_FAILED_DELETE_USER_DB = "Failed to delete User with the given input parameters";

var frbAdmin = require("firebase-admin");

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

var self = {

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
                var db = frbAdmin.database();
                var dbRef = db.ref("users");

                dbRef.orderByChild('email').equalTo(email).once("value", function(snapshot) {

                    try {
                        const keys = Object.keys(snapshot.val())
                    
                        if (keys != undefined) {
                            resUser = snapshot.val()[keys[0]]
                        
                            if (resUser != null && resUser != undefined) {
                                logUtils.logMessage(TAG, `${MSG_GOT_USER_DB}`);
                                handleSuccess();
                            } else {
                                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB}`);
                                handleError();
                            }
    
                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB}`);
                            handleError();
                        }

                    } catch (err) {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB} ${err}`);
                        handleError();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB} ${err}`);
                    handleError();
                });

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

    findAll : function (callback) {
        try {
            var resUsers = null;

            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true, resUsers);
                }
            }

            var handleError = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(false, null);
                }
            }

            var db = frbAdmin.database();
            var dbRef = db.ref("users");

            dbRef.orderByChild('email').once("value", function(snapshot) {

                try {
                    const keys = Object.keys(snapshot.val())
                    
                    if (keys != undefined) {
                        resUsers = Object.values(snapshot.val());
                        
                        if (resUsers != null && resUsers != undefined) {
                            logUtils.logMessage(TAG, `${MSG_GOT_USERS_DB}`);
                            handleSuccess();
                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB}`);
                            handleError();
                        }

                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB}`);
                        handleError();
                    }

                } catch (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB} ${err}`);
                    handleError();
                }

            }, function (err) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB} ${err}`);
                handleError();
            });

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_GET_USERS_DB);
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

                var update = {
                    name: name, 
                    profilePic: profilePic, 
                    email: email,
                    latestViewedNotification: latestViewedNotification,
                    updatedAt: new Date().toISOString()
                };

                this.findUser(email, function(success, user) {
                    var db = frbAdmin.database();
                    var usersRef = db.ref("users");

                    if (success && user != null && user != undefined) {
                        user.name = update.name;
                        user.profilePic = update.profilePic;
                        user.email = update.email;
                        user.latestViewedNotification = update.latestViewedNotification;
                        user.updatedAt = new Date().toISOString();

                        if (user.firebaseUid != undefined) {
                            var userRef = usersRef.child(user.firebaseUid);
                            userRef.update(user, function(err) {
    
                                if (!err) {
                                    logUtils.logMessage(TAG, `${MSG_UPDATED_USER_DB}`);
                                    handleSuccess();
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_UPDATE_USER_DB} ${err}`);
                                    handleError();
                                }

                            });

                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_UPDATE_USER_DB}`);
                            handleError();
                        }

                    } else {
                        update.createdAt = new Date().toISOString();

                        var newUserRef = usersRef.push();
                        update.firebaseUid = newUserRef.getKey()
                        newUserRef.set(update);
                        
                        logUtils.logMessage(TAG, `${MSG_CREATED_USER_DB}`);
                        handleSuccess();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_DB} ${err}`);
                    handleError();
                });

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
                
                this.findUser(email, function(success, user) {
                    
                    if (success && user != null && user != undefined) {
                        
                        if (user.firebaseUid != undefined) {
                            var db = frbAdmin.database();
                            var usersRef = db.ref("users");

                            var userRef = usersRef.child(user.firebaseUid);
                            userRef.set({}, function(err) {
    
                                if (!err) {
                                    logUtils.logMessage(TAG, `${MSG_DELETED_USER_DB}`);
                                    handleSuccess();
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB} ${err}`);
                                    handleError();
                                }
                            });

                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB}`);
                            handleError();
                        }

                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB}`);
                        handleError();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB} ${err}`);
                    handleError();
                });

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

module.exports = self;
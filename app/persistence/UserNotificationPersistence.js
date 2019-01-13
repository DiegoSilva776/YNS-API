/**
 * Perform the Upsert, Find and Delete actions on objects of the class UserNotification
 */

const TAG = "UserNotificationPersistence";
const MSG_FAILED_SAVE_USER_NOTIFICATION_DB = "Failed to save UserNotification";
const MSG_CREATED_USER_NOTIFICATION_DB = "Created UserNotification";
const MSG_UPDATED_USER_NOTIFICATION_DB = "Updated UserNotification";
const MSG_FAILED_UPDATE_USER_NOTIFICATION_DB = "Failed to update UserNotification";
const MSG_GOT_USER_NOTIFICATION_DB = "Found UserNotification with the given input parameters";
const MSG_FAILED_GET_USER_NOTIFICATION_DB = "Failed to find UserNotification with the given input parameters";
const MSG_OR_USER_NOTIFICATION_ON_DB_IS_EMPTY = "or the UserNotification doesn't exist on the database";
const MSG_GOT_USER_NOTIFICATIONS_DB = "Found UserNotifications with the given input parameters";
const MSG_FAILED_GET_USER_NOTIFICATIONS_DB = "Failed to find UserNotifications with the given input parameters";
const MSG_OR_USER_NOTIFICATIONS_ON_DB_IS_EMPTY = "or the list of UserNotifications on the database is empty";
const MSG_DELETED_USER_NOTIFICATION_DB = "Deleted UserNotification with the given input parameters";
const MSG_FAILED_DELETE_USER_NOTIFICATION_DB = "Failed to delete UserNotification with the given input parameters";

var frbAdmin = require("firebase-admin");

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');
const idUtils = require('../utils/IdUtils.js');

var self = {

    findUserNotification: function (userId, notificationId, callback) {
        try {
            var resUserNotification = null;

            // Possible responses
            var handleSuccess = function () {

                if (evalUtils.isValidVal(callback)) {
                    callback(true, resUserNotification);
                } else {
                    callback(false, null);
                }
            }

            var handleError = function () {
                callback(false, null);
            }

            if (evalUtils.isValidVal(userId),
                evalUtils.isValidVal(notificationId)) {
                var db = frbAdmin.database();
                var dbRef = db.ref("userNotifications");

                const userNotificationId = idUtils.getUserNotificationFirebaseId(userId, notificationId);

                dbRef.orderByChild('firebaseUid').equalTo(userNotificationId).once("value", function (snapshot) {

                    try {

                        if (!evalUtils.isValidVal(snapshot.val())) {
                            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB} ${MSG_OR_USER_NOTIFICATION_ON_DB_IS_EMPTY}`);
                            handleSuccess();
                        } else {
                            const keys = Object.keys(snapshot.val())

                            if (evalUtils.isValidVal(keys)) {
                                resUserNotification = snapshot.val()[keys[0]]

                                if (evalUtils.isValidVal(resUserNotification)) {
                                    logUtils.logMessage(TAG, `${MSG_GOT_USER_NOTIFICATION_DB}`);
                                    handleSuccess();
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB}`);
                                    handleError();
                                }

                            } else {
                                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB}`);
                                handleError();
                            }
                        }

                    } catch (err) {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB} ${err}`);
                        handleError();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB} ${err}`);
                    handleError();
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_GET_USER_NOTIFICATION_DB);
            }

            handleError();
        }
    },

    findAll: function (callback) {
        try {
            var resUserNotifications = null;

            // Possible responses
            var handleSuccess = function () {

                if (evalUtils.isValidVal(callback)) {
                    callback(true, resUserNotifications);
                } else {
                    callback(false, null);
                }
            }

            var handleError = function () {
                callback(false, null);
            }

            var db = frbAdmin.database();
            var dbRef = db.ref("userNotifications");

            dbRef.orderByChild('user').once("value", function (snapshot) {

                try {
                    if (!evalUtils.isValidVal(snapshot.val())) {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB} ${MSG_OR_USER_NOTIFICATIONS_ON_DB_IS_EMPTY}`);
                        handleSuccess();
                    } else {
                        resUserNotifications = Object.values(snapshot.val());

                        if (evalUtils.isValidList(resUserNotifications)) {
                            logUtils.logMessage(TAG, `${MSG_GOT_USER_NOTIFICATIONS_DB}`);
                            handleSuccess();
                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB} ${MSG_OR_USER_NOTIFICATIONS_ON_DB_IS_EMPTY}`);
                            handleSuccess();
                        }
                    }

                } catch (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB} ${err}`);
                    handleError();
                }

            }, function (err) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB} ${err}`);
                handleError();
            });

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_GET_USER_NOTIFICATIONS_DB);
            }

            handleError();
        }
    },

    upsertUserNotification: function (user, notification, callback) {

        try {
            // Possible responses
            var handleSuccess = function () {

                if (evalUtils.isValidVal(callback)) {
                    callback(true);
                } else {
                    callback(false);
                }
            }

            var handleError = function () {
                callback(false);
            }

            if (evalUtils.isValidVal(user) &&
                evalUtils.isValidVal(notification)) {

                var update = {
                    user: user,
                    notification: notification,
                    updatedAt: new Date().toISOString()
                };

                this.findUserNotification(user.firebaseUid, notification.firebaseUid, function (success, userNotification) {
                    var db = frbAdmin.database();

                    if (success && evalUtils.isValidVal(userNotification)) {

                        // Update a UserNotification
                        if (evalUtils.isValidVal(userNotification.firebaseUid)) {
                            userNotification.user = update.user;
                            userNotification.notification = update.notification;
                            userNotification.updatedAt = new Date().toISOString();

                            var userNotificationsRef = db.ref("userNotifications");
                            var userNotificationRef = userNotificationsRef.child(userNotification.firebaseUid);
                            userNotificationRef.update(userNotification, function (err) {

                                if (!err) {
                                    logUtils.logMessage(TAG, `${MSG_UPDATED_USER_NOTIFICATION_DB}`);
                                    handleSuccess();
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_UPDATE_USER_NOTIFICATION_DB} ${err}`);
                                    handleError();
                                }

                            });

                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_UPDATE_USER_NOTIFICATION_DB}`);
                            handleError();
                        }

                    } else {

                        // Create a new UserNotification object
                        if (idUtils.getUserNotificationFirebaseId(user.firebaseUid, notification.firebaseUid)) {
                            update.createdAt = new Date().toISOString();
                            update.firebaseUid = idUtils.getUserNotificationFirebaseId(user.firebaseUid, notification.firebaseUid);

                            var userNotificationRef = db.ref(`userNotifications/${update.firebaseUid}`);
                            userNotificationRef.set(update);

                            logUtils.logMessage(TAG, `${MSG_CREATED_USER_NOTIFICATION_DB}`);
                            handleSuccess();
                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_NOTIFICATION_DB}`);
                            handleError();
                        }
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_NOTIFICATION_DB} ${err}`);
                    handleError();
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_NOTIFICATION_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_NOTIFICATION_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_SAVE_USER_NOTIFICATION_DB);
            }

            handleError();
        }
    },

    deleteUserNotification: function (userId, notificationId, callback) {
        try {
            // Possible responses
            var handleSuccess = function () {

                if (evalUtils.isValidVal(callback)) {
                    callback(true);
                } else {
                    callback(false);
                }
            }

            var handleError = function () {
                callback(false);
            }

            if (evalUtils.isValidVal(userId) &&
                evalUtils.isValidVal(notificationId)) {

                this.findUserNotification(userId, notificationId, function (success, userNotification) {

                    if (success && evalUtils.isValidVal(userNotification)) {

                        if (evalUtils.isValidVal(userNotification.firebaseUid)) {
                            var db = frbAdmin.database();
                            var userNotificationsRef = db.ref("userNotifications");

                            var userNotificationRef = userNotificationsRef.child(userNotification.firebaseUid);
                            userNotificationRef.set({}, function (err) {

                                if (!err) {
                                    logUtils.logMessage(TAG, `${MSG_DELETED_USER_NOTIFICATION_DB}`);
                                    handleSuccess();
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB} ${err}`);
                                    handleError();
                                }
                            });

                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB}`);
                            handleError();
                        }

                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB}`);
                        handleError();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB} ${err}`);
                    handleError();
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_DELETE_USER_NOTIFICATION_DB);
            }

            handleError();
        }
    }

}

module.exports = self;
/**
 * Perform the Upsert, Find and Delete actions on objects of the class Notification
 */

const TAG = "NotificationPersistence";
const MSG_FAILED_SAVE_NOTIFICATION_DB = "Failed to save Notification";
const MSG_CREATED_NOTIFICATION_DB = "Created Notification";
const MSG_UPDATED_NOTIFICATION_DB = "Updated Notification";
const MSG_FAILED_UPDATE_NOTIFICATION_DB = "Failed to update Notification";
const MSG_GOT_NOTIFICATION_DB = "Found Notification with the given input parameters";
const MSG_OR_NOTIFICATION_ON_DB_IS_EMPTY = "Or the notification doesn't exist on the database";
const MSG_FAILED_GET_NOTIFICATION_DB = "Failed to find Notification with the given input parameters";
const MSG_GOT_NOTIFICATIONS_DB = "Found Notifications with the given input parameters";
const MSG_OR_NOTIFICATIONS_ON_DB_IS_EMPTY = "Or the list of Notifications on the DB is empty";
const MSG_FAILED_GET_NOTIFICATIONS_DB = "Failed to find Notifications with the given input parameters";
const MSG_DELETED_NOTIFICATION_DB = "Deleted Notification with the given input parameters";
const MSG_FAILED_DELETE_NOTIFICATION_DB = "Failed to delete Notification with the given input parameters";

var frbAdmin = require("firebase-admin");

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

var self = {

    findNotification : function (title, scheduleTime, callback) {
        try {
            var resNotification = null;

            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true, resNotification);
                } else {
                    callback(false, null);
                }
            }

            var handleError = function() {
                callback(false, null);
            }

            if (evalUtils.isValidVal(title),
                evalUtils.isValidVal(scheduleTime)) {
                var db = frbAdmin.database();
                var dbRef = db.ref("notifications");

                dbRef.orderByChild('title').equalTo(title).once("value", function(snapshot) {

                    try {

                        if (!evalUtils.isValidVal(snapshot.val())) {
                            logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB} ${MSG_OR_NOTIFICATION_ON_DB_IS_EMPTY}`);
                            handleSuccess();
                        } else {
                            const keys = Object.keys(snapshot.val())
                        
                            if (keys != undefined) {
                                resNotification = snapshot.val()[keys[0]]
                            
                                if (evalUtils.isValidVal(resNotification)) {

                                    if (evalUtils.isValidVal(resNotification.scheduleTime) && resNotification.scheduleTime == scheduleTime) {
                                        logUtils.logMessage(TAG, `${MSG_GOT_NOTIFICATION_DB}`);
                                        handleSuccess();
                                    } else {
                                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB}`);
                                        handleError();
                                    }
                                    
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB}`);
                                    handleError();
                                }
        
                            } else {
                                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB}`);
                                handleError();
                            }
                        }

                    } catch (err) {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB} ${err}`);
                        handleError();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB} ${err}`);
                    handleError();
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_GET_NOTIFICATION_DB);
            }
            
            handleError();
        }
    },

    findAll : function (callback) {
        try {
            var resNotifications = null;

            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true, resNotifications);
                } else {
                    callback(false, null)
                }
            }

            var handleError = function() {
                callback(false, null);
            }

            var db = frbAdmin.database();
            var dbRef = db.ref("notifications");

            dbRef.orderByChild('title').once("value", function(snapshot) {

                try {
                    
                    if (!evalUtils.isValidVal(snapshot.val())) {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB} ${MSG_OR_NOTIFICATIONS_ON_DB_IS_EMPTY}`);
                        handleSuccess();
                    } else {
                        const keys = Object.keys(snapshot.val())
                    
                        if (evalUtils.isValidVal(keys)) {
                            resNotifications = Object.values(snapshot.val());
                            
                            if (evalUtils.isValidVal(resNotifications)) {
                                logUtils.logMessage(TAG, `${MSG_GOT_NOTIFICATIONS_DB}`);
                                handleSuccess();
                            } else {
                                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB}`);
                                handleError();
                            }
    
                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB}`);
                            handleError();
                        }
                    }

                } catch (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB} ${err}`);
                    handleError();
                }

            }, function (err) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB} ${err}`);
                handleError();
            });

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_GET_NOTIFICATIONS_DB);
            }
            
            handleError();
        }
    },

    upsertNotification : function (title, scheduleTime, body, dueDate, callback) {

        try {
            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true);
                } else {
                    callback(false);
                }
            }

            var handleError = function() {
                callback(false);
            }

            if (evalUtils.isValidVal(title) &&
                evalUtils.isValidVal(scheduleTime) &&
                evalUtils.isValidVal(body) &&
                evalUtils.isValidVal(dueDate)) {

                var update = {
                    title: title, 
                    scheduleTime: scheduleTime, 
                    body: body,
                    dueDate: dueDate,
                    updatedAt: new Date().toISOString()
                };

                this.findNotification(title, scheduleTime, function(success, notification) {
                    var db = frbAdmin.database();
                    var notificationsRef = db.ref("notifications");

                    if (success && evalUtils.isValidVal(notification)) {
                        notification.title = update.title;
                        notification.scheduleTime = update.scheduleTime;
                        notification.body = update.body;
                        notification.dueDate = update.dueDate;
                        notification.updatedAt = new Date().toISOString();

                        if (evalUtils.isValidVal(notification.firebaseUid)) {
                            var notificationRef = notificationsRef.child(notification.firebaseUid);
                            notificationRef.update(notification, function(err) {
    
                                if (!err) {
                                    logUtils.logMessage(TAG, `${MSG_UPDATED_NOTIFICATION_DB}`);
                                    handleSuccess();
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_UPDATE_NOTIFICATION_DB} ${err}`);
                                    handleError();
                                }

                            });

                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_UPDATE_NOTIFICATION_DB}`);
                            handleError();
                        }

                    } else {
                        update.createdAt = new Date().toISOString();

                        var newNotificationRef = notificationsRef.push();
                        update.firebaseUid = newNotificationRef.getKey()
                        newNotificationRef.set(update);
                        
                        logUtils.logMessage(TAG, `${MSG_CREATED_NOTIFICATION_DB}`);
                        handleSuccess();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_NOTIFICATION_DB} ${err}`);
                    handleError();
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_NOTIFICATION_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_NOTIFICATION_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_SAVE_NOTIFICATION_DB);
            }
                
            handleError();
        }
    },

    deleteNotification : function (title, scheduleTime, callback) {
        try {
            // Possible responses
            var handleSuccess = function() {

                if (evalUtils.isValidVal(callback)) {
                    callback(true);
                } else {
                    callback(false);
                }
            }

            var handleError = function() {
                callback(false);
            }

            if (evalUtils.isValidVal(title),
                evalUtils.isValidVal(scheduleTime)) {
                
                this.findNotification(title, scheduleTime, function(success, notification) {
                    
                    if (success && evalUtils.isValidVal(notification)) {
                        
                        if (evalUtils.isValidVal(notification.firebaseUid)) {
                            var db = frbAdmin.database();
                            var notificationsRef = db.ref("notifications");

                            var notificationRef = notificationsRef.child(notification.firebaseUid);
                            notificationRef.set({}, function(err) {
    
                                if (!err) {
                                    logUtils.logMessage(TAG, `${MSG_DELETED_NOTIFICATION_DB}`);
                                    handleSuccess();
                                } else {
                                    logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB} ${err}`);
                                    handleError();
                                }
                            });

                        } else {
                            logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB}`);
                            handleError();
                        }

                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB}`);
                        handleError();
                    }

                }, function (err) {
                    logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB} ${err}`);
                    handleError();
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_DELETE_NOTIFICATION_DB);
            }
            
            handleError();
        }
    }

}

module.exports = self;
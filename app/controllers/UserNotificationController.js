/**
 * Perform the Upsert, Find and Delete actions on objects of the class UserNotification
 */

const TAG = "UserNotificationController";

const MSG_SUCCESS = "Success";

const MSG_FAILED_SAVE_USER_NOTIFICATION_DB = "Failed to save UserNotification";
const MSG_FAILED_GET_USER_NOTIFICATION_DB = "Failed to find UserNotification with the given input parameters";
const MSG_FAILED_GET_USER_NOTIFICATIONS_DB = "Failed to find UserNotifications with the given input parameters";
const MSG_FAILED_DELETE_USER_NOTIFICATION_DB = "Failed to delete UserNotification with the given input parameters";

const userNotificationPersistence = require('../persistence/UserNotificationPersistence.js');

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

var self = {

    findUserNotification: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_GET_USER_NOTIFICATION_DB
            };

            if (!evalUtils.hasErrors(req, res)) {

                userNotificationPersistence.findUserNotification(
                    req.params.userId,
                    req.params.notificationId,
                    function (success, userNotification) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(userNotification)) {
                                response.data = userNotification;
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array();

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB} ${err}`);

            res.send(response);
        }
    },

    findAll: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_GET_USER_NOTIFICATIONS_DB
            };

            if (!evalUtils.hasErrors(req, res)) {
                userNotificationPersistence.findAll(
                    function (success, userNotifications) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(userNotifications)) {
                                response.data = userNotifications;
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB} ${err}`);

            res.send(response);
        }
    },

    upsertUserNotification: function (req, res) {

        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_SAVE_USER_NOTIFICATION_DB
            };

            if (!evalUtils.hasErrors(req, res)) {

                userNotificationPersistence.upsertUserNotification(
                    req.body.user,
                    req.body.notification,
                    function (success) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.data = true;
                            response.msg = MSG_SUCCESS;
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_NOTIFICATION_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_NOTIFICATION_DB} ${err}`);

            res.send(response);
        }
    },

    deleteUserNotification: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_DELETE_USER_NOTIFICATION_DB
            };

            if (!evalUtils.hasErrors(req, res)) {
                userNotificationPersistence.deleteUserNotification(
                    req.body.userId,
                    req.body.notificationId,
                    function (success) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.data = true;
                            response.msg = MSG_SUCCESS;
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB} ${err}`);

            res.send(response);
        }
    }

}

module.exports = self;
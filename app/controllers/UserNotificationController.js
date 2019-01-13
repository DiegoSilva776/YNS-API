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

            if (!evalUtils.hasErrors(req)) {

                userNotificationPersistence.findUserNotification(
                    evalUtils.cleanObj(req.params.userId),
                    evalUtils.cleanObj(req.params.notificationId),
                    function (success, userNotification) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(userNotification)) {
                                response.data = evalUtils.unescapeObj(userNotification);
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATION_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

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

            if (!evalUtils.hasErrors(req)) {
                userNotificationPersistence.findAll(
                    function (success, userNotifications) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(userNotifications)) {
                                response.data = evalUtils.unescapeObj(userNotifications);
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_NOTIFICATIONS_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

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

            if (!evalUtils.hasErrors(req)) {

                userNotificationPersistence.upsertUserNotification(
                    evalUtils.cleanObj(req.body.user),
                    evalUtils.cleanObj(req.body.notification),
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
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_NOTIFICATION_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

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

            if (!evalUtils.hasErrors(req)) {
                userNotificationPersistence.deleteUserNotification(
                    evalUtils.cleanObj(req.body.userId),
                    evalUtils.cleanObj(req.body.notificationId),
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
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_NOTIFICATION_DB} ${err}`);

            res.send(response);
        }
    }

}

module.exports = self;
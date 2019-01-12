/**
 * Perform the Upsert, Find and Delete actions on objects of the class Notification
 */

const TAG = "NotificationController";

const MSG_SUCCESS = "Success";

const MSG_FAILED_SAVE_NOTIFICATION_DB = "Failed to save Notification";
const MSG_FAILED_GET_NOTIFICATION_DB = "Failed to find Notification with the given input parameters";
const MSG_FAILED_GET_NOTIFICATIONS_DB = "Failed to find Notifications with the given input parameters";
const MSG_FAILED_DELETE_NOTIFICATION_DB = "Failed to delete Notification with the given input parameters";

const notificationPersistence = require('../persistence/NotificationPersistence.js');

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

var self = {

    findNotification: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_GET_NOTIFICATION_DB
            };

            if (!evalUtils.hasErrors(req, res)) {

                notificationPersistence.findNotification(
                    req.params.title,
                    req.params.scheduleTime,
                    function (success, notification) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(notification)) {
                                response.data = notification;
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATION_DB} ${err}`);

            res.send(response);
        }
    },

    findAll: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_GET_NOTIFICATIONS_DB
            };

            if (!evalUtils.hasErrors(req, res)) {
                notificationPersistence.findAll(
                    function (success, notifications) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(notifications)) {
                                response.data = notifications;
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_GET_NOTIFICATIONS_DB} ${err}`);

            res.send(response);
        }
    },

    upsertNotification: function (req, res) {

        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_SAVE_NOTIFICATION_DB
            };

            if (!evalUtils.hasErrors(req, res)) {

                notificationPersistence.upsertNotification(
                    req.body.title,
                    req.body.scheduleTime,
                    req.body.body,
                    req.body.dueDate,
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
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_NOTIFICATION_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_NOTIFICATION_DB} ${err}`);

            res.send(response);
        }
    },

    deleteNotification: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_DELETE_NOTIFICATION_DB
            };

            if (!evalUtils.hasErrors(req, res)) {
                notificationPersistence.deleteNotification(
                    req.body.title,
                    req.body.scheduleTime,
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
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_NOTIFICATION_DB} ${err}`);

            res.send(response);
        }
    }

}

module.exports = self;
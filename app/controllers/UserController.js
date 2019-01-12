/**
 * Perform the Upsert, Find and Delete actions on objects of the class User
 */

const TAG = "UserController";

const MSG_SUCCESS = "Success";

const MSG_FAILED_SAVE_USER_DB = "Failed to save User";
const MSG_FAILED_GET_USER_DB = "Failed to find User with the given input parameters";
const MSG_FAILED_GET_USERS_DB = "Failed to find Users with the given input parameters";
const MSG_FAILED_DELETE_USER_DB = "Failed to delete User with the given input parameters";

const userPersistence = require('../persistence/UserPersistence.js');

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

var self = {

    findUser: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_GET_USER_DB
            };

            if (!evalUtils.hasErrors(req, res)) {

                userPersistence.findUser(
                    req.params.email,
                    function (success, user) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.data = user;
                            response.msg = MSG_SUCCESS;
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            res.send(response);
        }
    },

    findAll: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_GET_USERS_DB
            };

            if (!evalUtils.hasErrors(req, res)) {
                userPersistence.findAll(
                    function (success, users) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.data = users;
                            response.msg = MSG_SUCCESS;
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            res.send(response);
        }
    },

    upsertUser: function (req, res) {

        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_SAVE_USER_DB
            };

            if (!evalUtils.hasErrors(req, res)) {

                userPersistence.upsertUser(
                    req.body.email,
                    req.body.name,
                    req.body.profilePic,
                    req.body.latestNotification,
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
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            res.send(response);
        }
    },

    deleteUser: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_SAVE_USER_DB
            };

            if (!evalUtils.hasErrors(req, res)) {
                userPersistence.deleteUser(
                    req.body.email,
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
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB} ${err}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req, res).array()

                res.send(response);
            }

        } catch (err) {
            res.send(response);
        }
    }

}

module.exports = self;
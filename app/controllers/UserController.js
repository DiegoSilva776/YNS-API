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

            if (!evalUtils.hasErrors(req)) {

                userPersistence.findUser(
                    evalUtils.cleanObj(req.params.email),
                    function (success, user) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(user)) {
                                response.data = evalUtils.unescapeObj(user);
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USER_DB} ${err}`);

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

            if (!evalUtils.hasErrors(req)) {
                userPersistence.findAll(
                    function (success, users) {

                        if (success) {
                            response.status = evalUtils.STATUS_SUCCESS;
                            response.msg = MSG_SUCCESS;

                            if (evalUtils.isValidVal(users)) {
                                response.data = evalUtils.unescapeObj(users);
                            } else {
                                response.data = {};
                            }
                        }

                        res.send(response);
                    }
                );
            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_GET_USERS_DB} ${err}`);

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

            if (!evalUtils.hasErrors(req)) {

                userPersistence.upsertUser(
                    evalUtils.cleanObj(req.body.email),
                    evalUtils.cleanObj(req.body.name),
                    evalUtils.cleanObj(req.body.profilePic),
                    evalUtils.cleanObj(req.body.latestNotification),
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
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_USER_DB} ${err}`);

            res.send(response);
        }
    },

    deleteUser: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_DELETE_USER_DB
            };

            if (!evalUtils.hasErrors(req)) {
                userPersistence.deleteUser(
                    evalUtils.cleanObj(req.body.email),
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
                logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_DELETE_USER_DB} ${err}`);

            res.send(response);
        }
    }

}

module.exports = self;
/**
 * Perform the upload of an image to Firebase Storage and returns the image downloadUrl.
 */

const TAG = "StorageController";

const MSG_SUCCESS = "Success";
const MSG_INVALID_USER = "Invalid user, please make sure that a user with the given email is registered";
const MSG_FAILED_GET_IMAGE_STORAGE = "Failed to upload image";

const userPersistence = require('../persistence/UserPersistence.js');
const storagePersistence = require('../persistence/StoragePersistence.js');

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

var self = {
    
    uploadImage: function (req, res) {
        try {
            var response = {
                status: evalUtils.STATUS_ERROR,
                data: {},
                msg: MSG_FAILED_GET_IMAGE_STORAGE
            };

            if (!evalUtils.hasErrors(req)) {
                var userEmail = evalUtils.cleanObj(req.body.userEmail);
                var filename = evalUtils.cleanObj(req.body.filename);
                var fileExtension = evalUtils.cleanObj(req.body.fileExtension);
                var base64String = req.body.base64String;

                userPersistence.findUser(userEmail, function(success, user) {

                    if (success) {
                        storagePersistence.uploadImage(
                            user.firebaseUid,
                            filename,
                            fileExtension,
                            base64String,
                            function (success, image) {
        
                                if (success) {
                                    response.status = evalUtils.STATUS_SUCCESS;
                                    response.msg = MSG_SUCCESS;
        
                                    if (evalUtils.isValidVal(image)) {
                                        response.data = image;
                                    } else {
                                        response.data = {};
                                    }
                                }
        
                                res.send(response);
                            }
                        );
                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_GET_IMAGE_STORAGE}`);

                        response.status = evalUtils.STATUS_FAILED_INPUT;
                        response.data = MSG_INVALID_USER;

                        res.send(response);
                    }
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_GET_IMAGE_STORAGE}`);

                response.status = evalUtils.STATUS_FAILED_INPUT;
                response.data = evalUtils.hasErrors(req);

                res.send(response);
            }

        } catch (err) {
            logUtils.logMessage(TAG, `${MSG_FAILED_GET_IMAGE_STORAGE} ${err}`);

            res.send(response);
        }
    }

}

module.exports = self;
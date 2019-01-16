/**
 * Perform the Upsert, Find and Delete actions on objects of the class Storage
 */

const TAG = "StoragePersistence";
const MSG_FAILED_SAVE_STORAGE_DB = "Failed to save file to Storage";
const MSG_UPLOAD_FILE_STORAGE_DB = "Uploaded file to Storage";
const MSG_TEMP_IMG_FILE_RETRIEVED = "Temp image file has been retrieved from local system";
const MSG_TEMP_IMG_FILE_CREATED_STORED_LOCALLY = "Temp image file has been created and stored in the local fylesystem";

var fs = require('fs');
var frbAdmin = require("firebase-admin");

const logUtils = require('../utils/LogUtils.js');
const evalUtils = require('../utils/EvalUtils.js');

var self = {

    uploadImage: function (userFirebaseUid, filename, fileExtension, base64String, callback) {

        try {
            var urlImg = "";

            // Possible responses
            var handleSuccess = function () {

                if (evalUtils.isValidVal(callback)) {
                    callback(true, urlImg);
                } else {
                    callback(false, "");
                }
            }

            var handleError = function () {
                callback(false, "");
            }

            if (evalUtils.isValidVal(userFirebaseUid) &&
                evalUtils.isValidVal(filename) &&
                evalUtils.isValidVal(fileExtension) &&
                evalUtils.isValidVal(base64String)) {

                var storageFilename = `profile_img_${userFirebaseUid}_${filename}${fileExtension}`;

                const base64Image = base64String.split(';base64,').pop();
                fs.writeFile(storageFilename, base64Image, {encoding: 'base64'}, function(err) {

                    if (err == undefined) {
                        logUtils.logMessage(TAG, MSG_TEMP_IMG_FILE_CREATED_STORED_LOCALLY);

                        fs.readFile(storageFilename, function(err, fileContents) {

                            if (err == undefined) {
                                logUtils.logMessage(TAG, MSG_TEMP_IMG_FILE_RETRIEVED);

                                // Save the file on the Storage
                                frbAdmin.storage().bucket().upload(storageFilename, {
                                    // Support for HTTP requests made with `Accept-Encoding: gzip`
                                    gzip: true,
                                    metadata: {
                                        // Enable long-lived HTTP caching headers
                                        // Use only if the contents of the file will never change
                                        // (If the contents will change, use cacheControl: 'no-cache')
                                        cacheControl: 'public, max-age=31536000',
                                    }
                                }).then(results => {

                                    // Delete the temporary file that has been created locally
                                    fs.unlinkSync(storageFilename);

                                    // Retrieve the uploaded file from the Storage in order to return 
                                    // its public download link
                                    const file = frbAdmin.storage().bucket().file(storageFilename);

                                    return file.getSignedUrl({
                                        action: 'read',
                                        expires: '01-01-2500'
                                    }).then(signedUrls => {
                                        
                                        if (signedUrls[0] != undefined) {
                                            urlImg = signedUrls[0];

                                            logUtils.logMessage(TAG, `${MSG_UPLOAD_FILE_STORAGE_DB}`);
                                            handleSuccess();
                                        } else {
                                            logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_STORAGE_DB}`);
                                            handleError();
                                        }
                                    });
                                });

                            } else {
                                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_STORAGE_DB}`);
                                handleError();
                            }
                        });

                    } else {
                        logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_STORAGE_DB}`);
                        handleError();
                    }
                });

            } else {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_STORAGE_DB}`);
                handleError();
            }

        } catch (err) {

            if (evalUtils.isValidVal(err)) {
                logUtils.logMessage(TAG, `${MSG_FAILED_SAVE_STORAGE_DB} ${err}`);
            } else {
                logUtils.logMessage(TAG, MSG_FAILED_SAVE_STORAGE_DB);
            }

            handleError();
        }
    }

}

module.exports = self;
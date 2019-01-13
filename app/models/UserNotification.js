 /**
 * UserNotification.
 * 
 * A Mongoose.Schema maps the schema of the model to a collection on MongoDB.
 */

var mongoose = require('mongoose');

var UserNotificationSchema = new mongoose.Schema({
    firebaseUid: String,
    user : {
        notEmpty: true,
        type     : String, 
        required : true,
        unique : true
    },
    notification : {
        notEmpty: true,
        type     : String, 
        required : true,
        unique : true
    },
    createdAt : {
        type     : String, 
        required : true
    },
    updatedAt : {
        type     : String, 
        required : true
    }
});


// Exports Mongoose model to be used within the application
module.exports.schema = UserNotificationSchema;
module.exports.model = mongoose.model('UserNotification', UserNotificationSchema);
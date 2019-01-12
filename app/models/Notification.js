 /**
 * Notification.
 * 
 * A Mongoose.Schema, maps the schema of the model to a collection on MongoDB.
 */

var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({
    firebaseUid: String,
    title : {
        notEmpty: true,
        type     : String, 
        required : true,
        unique : true
    },
    body : {
        type : String,
        isLength: {
            options: [{max: 2000}],
            errorMessage: "The first name must be under 200 characters"
        }
    },
    scheduleTime : {
        type : String,
        isLength: {
            options: [{max: 50}],
            errorMessage: "The first name must be under 200 characters"
        }
    },
    dueDate : {
        type : String,
        isLength: {
            options: [{max: 50}],
            errorMessage: "The first name must be under 200 characters"
        }
    },
    viewedByAll: false,
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
module.exports.schema = NotificationSchema;
module.exports.model = mongoose.model('Notification', NotificationSchema);
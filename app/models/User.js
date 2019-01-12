 /**
 * User.
 * 
 * A Mongoose.Schema, maps the schema of the model to a collection on MongoDB.
 */

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firebaseUid: String,
    email : {
        notEmpty: true,
        type     : String, 
        required : true,
        unique : true
    },
    name : {
        type : String,
        isLength: {
            options: [{max: 200}],
            errorMessage: "The first name must be under 200 characters"
        }
    },
    profilePic : String,
    latestViewedNotification : String,
    archived: false,
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
module.exports.schema = UserSchema;
module.exports.model = mongoose.model('User', UserSchema);
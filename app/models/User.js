 /**
 * User.
 * 
 * A Mongoose.Schema, maps the schema of the model to a collection on MongoDB.
 */

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email : {
        type     : String, 
        required : true,
        unique : true
    },
    name : String,
    profilePic : String,
    latestViewedNotification : String,
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
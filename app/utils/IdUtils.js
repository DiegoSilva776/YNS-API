/**
 * This class provides usefull methods to manage the database, local files, data encryption and etc.
 */

var crypto = require('crypto');
var env    = require('./EnvUtils');

module.exports = {
    
    /**
     * Return a unique identifier given its length
     */
    getUniqueId : function(len){
        var buf = [];
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charlen = chars.length;
        
        for (var i = 0; i < len; ++i) {
            buf.push(chars[this.getRandomInt(0, charlen - 1)]);
        }
        
        return buf.join('');
    },

    getFirebaseIdFromEmail: function(email){
        try {
            return email.replace()

        } catch (err) {
            return false
        }
    },

    /**
     * Get a random integer between a range of numbers
     */
    getRandomInt : function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Get a hashed value based on a text plain input
     */
    getHashedValue : function(plainValue){
        // use your hashing algorithm of choice here
        
        return plainValue;
    },
    
    /**
     * Get an object copy
     */
    getCopy : function(obj) {
        var copy = Object.assign({}, obj);

        return copy;
    }

};
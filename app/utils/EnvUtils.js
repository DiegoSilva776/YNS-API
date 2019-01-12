/**
 * Define environment variables for the system, for example what IP the server is going to use
 * and in which port the service is going to run.
 */

module.exports = {

    vars : {
        IP   : process.env.IP || "0.0.0.0",
        PORT : process.env.PORT || 3001,
        DB_IP   : "x.x.x.x",
        DB_PORT : 27027,
        DB_NAME : "yns_v1",
        FIREBASE_CRED_PATH: "../config/yns-firebase.json",
        FIREBASE_PROJ_URL: "https://youpernotificationsystem.firebaseio.com"
    }

};
/**
 * Author: Diego M. Silva - diegomsilva.com
 * Created at: 01/12/2019
 * Last updated: 01/12/2019
 * 
 * To test this API run:
 *    mocha
 *
 * To execute this API run: 
 *    nodemon index.js
 * 
 * License: MIT
 * https://opensource.org/licenses/MIT
 */

const APP_NAME = "YouperNotificationSystem - YNS API, v0.0.7"

var express    = require('express');
var helmet     = require('helmet');
var bodyParser = require('body-parser');
const { check } = require('express-validator/check');

var env       = require('./utils/EnvUtils');
var pathUtils = require('./utils/PathUtils');
var dbUtils   = require('./utils/DbUtils');

var userController = require('./controllers/UserController')
var notificationController = require('./controllers/NotificationController')
var userNotificationController = require('./controllers/UserNotificationController')
var storageController = require('./controllers/StorageController');

/**
 * Initialization
 */
// Creates an instance of the webserver and the router of the endpoints of the API
var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, cache-control');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
};

// Sets up an HTTP body parser to get data from json inputs
app.use(allowCrossDomain);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Creates a path to allow access to static files within the server
express.static(pathUtils.getPathStaticFiles());

/**
 * Routes
 */
app.get('/api', (req, res) => {
  res.send(APP_NAME)
});

// Users
app.get('/api/users', (req, res) => {
  userController.findAll(req, res)
});

app.get('/api/users/:email', [
  check('email').isEmail().normalizeEmail(),
], (req, res) => {
  userController.findUser(req, res)
});

app.post('/api/users', [
  check('email').isEmail().normalizeEmail(),
  check('name').isLength({ min: 1, max: 150 }).trim(),
  check('profilePic').isString().isLength({ max: 350 }),
  check('latestNotification').isString().isLength({ max: 350 }).trim(),
], (req, res) => {
  userController.upsertUser(req, res);
});

app.delete('/api/users', [
  check('email').isEmail().normalizeEmail()
], (req, res) => {
  userController.deleteUser(req, res);
});

// Notifications
app.get('/api/notifications', (req, res) => {
  notificationController.findAll(req, res)
});

app.get('/api/notifications/:title/:scheduleTime', [
  check('title').isString().isLength({ max: 350 }).trim(),
  check('scheduleTime').isString().isLength({ max: 50 }).trim(),
], (req, res) => {
  notificationController.findNotification(req, res)
});

app.post('/api/notifications', [
  check('title').isString().isLength({ max: 350 }).trim(),
  check('scheduleTime').isString().isLength({ max: 50 }).trim(),
  check('body').isString().trim(),
  check('dueDate').isString().trim().isLength({ max: 50 }),
], (req, res) => {
  notificationController.upsertNotification(req, res);
});

app.delete('/api/notifications', [
  check('title').isString().isLength({ max: 350 }).trim(),
  check('scheduleTime').isString().isLength({ max: 50 }).trim(),
], (req, res) => {
  notificationController.deleteNotification(req, res);
});

// UserNotifications
app.post('/api/getAllUserNotifications', (req, res) => {
  check('user'),
  userNotificationController.findAll(req, res)
});

app.get('/api/userNotifications/:userId/:notificationId', [
  check('userId').isString().isLength({ min: 1, max: 50 }).trim(),
  check('notificationId').isString().isLength({ min: 1, max: 50 }).trim()
], (req, res) => {
  userNotificationController.findUserNotification(req, res)
});

app.post('/api/userNotifications', [
  check('user'),
  check('notification')
], (req, res) => {
  userNotificationController.upsertUserNotification(req, res);
});

app.delete('/api/userNotifications', [
  check('userId').isString().isLength({ min: 1, max: 50 }).trim(),
  check('notificationId').isString().isLength({ min: 1, max: 50 }).trim()
], (req, res) => {
  userNotificationController.deleteUserNotification(req, res);
});

/**
 * Image uploads
 */
app.post('/api/imageUpload', [
  check('userEmail').isEmail().normalizeEmail(),
  check('filename').isString(),
  check('fileExtension').isString(),
  check('base64String').isString()
], (req, res) => {
  storageController.uploadImage(req, res);
});

/**
 * Server
 */
var server = app.listen(env.vars.PORT, env.vars.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  dbUtils.connectToFirebaseDB();

  console.log("%s, listening at http://%s:%s", APP_NAME, host, port);
});
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
 */

const APP_NAME = "YouperNotificationSystem - YNS API, v0.0.2"

var express    = require('express');
var helmet     = require('helmet');
var bodyParser = require('body-parser');

var env       = require('./utils/EnvUtils');
var pathUtils = require('./utils/PathUtils');

var dbManager = require('./controllers/UserController')

/**
 * Initialization
 */
// Creates an instance of the webserver and the router of the endpoints of the API
var app = express();
var router = express.Router();

// Sets up an HTTP body parser to get data from json inputs
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Creates a path to allow access to static files within the server
express.static(pathUtils.getPathStaticFiles());

/**
 * Routes
 */
router.route('/')
  .get(function (req, res) {
    res.send(APP_NAME)
  });

router.route('/update_profile_pic')
  .get(dbManager.upsertUser);

app.use('/api', router);

/**
 * Server
 */
var server = app.listen(env.vars.PORT, env.vars.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("%s, listening at http://%s:%s", APP_NAME, host, port);
});
'use strict';

require('babel-polyfill');

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _monk = require('monk');

var _monk2 = _interopRequireDefault(_monk);

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _config = require('../shared/config');

var _util = require('../shared/util');

var _scraper = require('./scraper');

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
var db = (0, _monk2.default)(_config.MONGO_URL, function (err) {
  if (err) {
    console.log('Error connecting to database');
    return;
  }
  console.log('connected to database');
}); // eslint-disable-line no-unused-vars

!_util.isProd && (0, _scraper.initDatabase)(db); // dumps existing data!!
_nodeSchedule2.default.scheduleJob('0 1 * * *', function () {
  (0, _scraper.fetchData)(db, true);
});

var app = (0, _express2.default)();

app.use((0, _compression2.default)());
app.use(_config.STATIC_PATH, _express2.default.static('dist'));
app.use(_config.STATIC_PATH, _express2.default.static('public'));
app.use((0, _morgan2.default)('dev'));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use('/', _routes2.default);

app.listen(_config.WEB_PORT, function () {
  // eslint-disable-next-line no-console
  console.log('Server running on port ' + _config.WEB_PORT + ' ' + (_util.isProd ? '(production)' : '(development).\nKeep "yarn dev:wds" running in an other terminal') + '.');
});
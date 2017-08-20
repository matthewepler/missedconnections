'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../shared/config');

var _util = require('../shared/util');

var renderApp = function renderApp(title) {
  return '<!doctype html>\n<html>\n  <head>\n    <title>' + title + '</title>\n    <link rel="shortcut icon" href="' + _config.STATIC_PATH + '/favicon.ico">\n    <link rel="stylesheet" href="' + _config.STATIC_PATH + '/css/styles.css">\n    <link href="https://fonts.googleapis.com/css?family=Crete+Round" rel="stylesheet">\n  </head>\n  <body>\n    <div class="' + _config.APP_CONTAINER_CLASS + '"></div>\n    <script src="' + (_util.isProd ? _config.STATIC_PATH : 'http://localhost:' + _config.WDS_PORT + '/dist') + '/js/bundle.js"></script>\n  </body>\n</html>\n';
};

exports.default = renderApp;
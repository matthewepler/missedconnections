'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

var WEB_PORT = exports.WEB_PORT = 5000;
var STATIC_PATH = exports.STATIC_PATH = '/static';
var APP_NAME = exports.APP_NAME = 'Missed Connections Haiku App';

var WDS_PORT = exports.WDS_PORT = 7000;
var APP_CONTAINER_CLASS = exports.APP_CONTAINER_CLASS = 'js-app';
var APP_CONTAINER_SELECTOR = exports.APP_CONTAINER_SELECTOR = '.' + APP_CONTAINER_CLASS;

var BASE_URL = exports.BASE_URL = 'https://newyork.craigslist.org/';
var SEARCH_URL = exports.SEARCH_URL = 'search/mis';
var SEARCH_ROOT = exports.SEARCH_ROOT = '.result-row';

var API_BASE_URL = exports.API_BASE_URL = 'http://localhost:5000';
var BUILD_URL = exports.BUILD_URL = '/build';

var MONGO_USERNAME = exports.MONGO_USERNAME = process.env.MONGO_USERNAME;
var MONGO_PASSWORD = exports.MONGO_PASSWORD = process.env.MONGO_PASSWORD;
var MONGO_URL = exports.MONGO_URL = 'mongodb://' + MONGO_USERNAME + ':' + MONGO_PASSWORD + '@ds149603.mlab.com:49603/heroku_mzstr9zt';
var MONGO_LOCAL_URL = exports.MONGO_LOCAL_URL = 'localhost:27017/missed_connections';
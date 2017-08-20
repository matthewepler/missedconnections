'use strict';

require('babel-polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactHotLoader = require('react-hot-loader');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _config = require('../shared/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars

// eslint-disable-line no-unused-vars
// babel-polyfill required for async/await features
var rootEl = document.querySelector(_config.APP_CONTAINER_SELECTOR);

// Hot Module Replacement
var wrapApp = function wrapApp(AppComponent) {
  return _react2.default.createElement(
    _reactHotLoader.AppContainer,
    null,
    _react2.default.createElement(AppComponent, null)
  );
};

_reactDom2.default.render(wrapApp(_app2.default), rootEl);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept('./app', function () {
    // eslint-disable-next-line global-require
    var NextApp = require('./app').default;
    _reactDom2.default.render(wrapApp(NextApp), rootEl);
  });
}
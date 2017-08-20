'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _animejs = require('animejs');

var _animejs2 = _interopRequireDefault(_animejs);

var _config = require('../shared/config');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this.state = {
      status: 'loading'
    };
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchHaiku();
      (0, _helpers.centerText)();
      window.addEventListener('resize', function () {
        (0, _helpers.centerText)();
      });
    }
  }, {
    key: 'fetchHaiku',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _axios2.default.get(_config.API_BASE_URL.concat(_config.BUILD_URL));

              case 2:
                data = _context.sent;

                this.setState({
                  status: 'loaded'
                });
                this.buildHaiku(data);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchHaiku() {
        return _ref.apply(this, arguments);
      }

      return fetchHaiku;
    }()
  }, {
    key: 'buildHaiku',
    value: function buildHaiku(data) {
      var haikuDiv = '<div class=\'haiku\'>\n        <p class=\'haiku-text one\'>' + data.data.one.text + '</p>\n        <p class=\'haiku-text two\'>' + data.data.two.text + '</p>\n        <p class=\'haiku-text three\'>' + data.data.three.text + '</p>\n      </div>';

      document.getElementById('haiku-placeholder').innerHTML = haikuDiv;
      this.setAnimations();
    }
  }, {
    key: 'destroyHaiku',
    value: function destroyHaiku() {
      this.paragraphAnimation && delete this.paragraphAnmiation;
      this.oneAnimation && delete this.oneAnimation;
      this.threeAnimation && delete this.threeAnimation;

      if (this.state.status !== 'loading') {
        var placeholder = document.getElementById('haiku-placeholder');
        while (placeholder.lastChild) {
          placeholder.removeChild(placeholder.lastChild);
        }
      }
    }
  }, {
    key: 'setAnimations',
    value: function setAnimations() {
      var _this2 = this;

      // const roll = 2 // 2 = heart
      var roll = parseInt(Math.random() * 4);
      var dir = _helpers.outros[roll]; // see helpers.js

      this.paragraphAnimation = (0, _animejs2.default)({
        targets: '.haiku',
        opacity: 0,
        duration: 4000,
        delay: 5000,
        easing: 'easeOutCubic',
        complete: function complete(anim) {
          if (roll === 2) {
            (0, _helpers.createHeart)(); // see helpers.js
            setTimeout(function () {
              _this2.destroyHaiku();
              _this2.fetchHaiku();
            }, 2000);
          } else {
            _this2.destroyHaiku();
            _this2.fetchHaiku();
          }
        }
      });

      var animeProps = {};
      if (dir.axis === 'x') {
        animeProps.top = { translateX: dir.top };
        animeProps.bottom = { translateX: dir.bottom };
      } else {
        animeProps.top = { translateY: dir.top };
        animeProps.bottom = { translateY: dir.bottom };
      }

      this.oneAnimation = (0, _animejs2.default)(Object.assign({}, animeProps.bottom, {
        targets: '.one',
        duration: 5000,
        delay: 3000,
        easing: 'easeInSine'
      }));
      this.threeAnimation = (0, _animejs2.default)(Object.assign({}, animeProps.top, {
        targets: '.three',
        duration: 5000,
        delay: 3000,
        easing: 'easeInSine'
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'wrapper', className: 'app-wrapper' },
        this.state.status === 'loading' ? _react2.default.createElement(
          'div',
          { id: 'loading' },
          'Loading...'
        ) : _react2.default.createElement('div', { id: 'haiku-placeholder' })
      );
    }
  }]);

  return App;
}(_react.Component);

exports.default = App;
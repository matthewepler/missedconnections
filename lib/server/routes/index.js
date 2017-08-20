'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../../shared/config');

var _renderApp = require('../render-app');

var _renderApp2 = _interopRequireDefault(_renderApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  res.send((0, _renderApp2.default)(_config.APP_NAME));
});

/* Show all data */
router.get('/list/:collection', function (req, res) {
  var db = req.db;
  var collection = db.get(req.params.collection);
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

router.get('/dump/:collection', function (req, res) {
  var db = req.db;
  var collection = db.get(req.params.collection);

  collection.drop().then(function (success) {
    var msg = success ? req.params.collection + ' collection dumped successfully' : 'unable to drop ' + req.params.collection + ' collection';
    res.send(msg);
  });
});

router.get(_config.BUILD_URL, function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var db, fives, sevens, randomFive1, randomSeven, randomFive2;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // build a random haiku and send back JSON
            db = req.db;
            fives = db.get('fives');
            sevens = db.get('sevens');
            _context.next = 5;
            return fives.aggregate([{ $sample: { size: 1 } }]);

          case 5:
            randomFive1 = _context.sent;
            _context.next = 8;
            return sevens.aggregate([{ $sample: { size: 1 } }]);

          case 8:
            randomSeven = _context.sent;
            _context.next = 11;
            return fives.aggregate([{ $sample: { size: 1 } }]);

          case 11:
            randomFive2 = _context.sent;


            res.json({
              'one': randomFive1[0],
              'two': randomSeven[0],
              'three': randomFive2[0]
            });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;
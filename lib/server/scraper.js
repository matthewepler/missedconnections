'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchPosts = exports.fetchData = undefined;

var fetchData = exports.fetchData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(db, yesterdayOnly, searchParams) {
    var resp, rootElement, links, posts, postObjects, postsCollection, fiveCount, sevenCount;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _axios2.default)(_config.SEARCH_URL, Object.assign({}, axiosConfig, searchParams));

          case 2:
            resp = _context.sent;

            if (!(resp.status !== 200)) {
              _context.next = 5;
              break;
            }

            throw new Error('Host response error');

          case 5:

            // load HTML data into Cheerio object
            $ = _cheerio3.default.load(resp.data);
            rootElement = $(_config.SEARCH_ROOT);

            if (!(!rootElement || rootElement.length <= 0)) {
              _context.next = 9;
              break;
            }

            throw new Error('No root element found');

          case 9:

            // get and save <a> links from HTML, returns array of strings
            links = parseLinks($, rootElement, yesterdayOnly);

            if (!(!links || links.length <= 0)) {
              _context.next = 12;
              break;
            }

            throw new Error('No links were found');

          case 12:
            _context.next = 14;
            return fetchPosts(links, axiosConfig);

          case 14:
            posts = _context.sent;

            if (!(!posts || posts.length <= 0)) {
              _context.next = 17;
              break;
            }

            throw new Error('Unable to retrieve posts');

          case 17:
            postObjects = [];

            posts.forEach(function (post) {
              if (post.data.status !== 200) throw new Error('Unexpected result from Craigslist');
              // create a data object based on the returned HTML data
              var thisPost = createPostObject(post.data.data, post.link);
              thisPost && postObjects.push(thisPost);
            });

            // insert results into database
            postsCollection = db.get('posts');

            postObjects.forEach(function (post) {
              postsCollection.insert({ post: post });
            });
            // feedback in terminal of scraping success
            console.log(postObjects.length + ' posts inserted');

            // look for phrases that have syllable pattern matching haiku style
            parseText(postObjects, db);

            // feedback in terminal of scraping success
            _context.next = 25;
            return db.get('fives').count();

          case 25:
            fiveCount = _context.sent;
            _context.next = 28;
            return db.get('sevens').count();

          case 28:
            sevenCount = _context.sent;

            console.log(fiveCount + ' fives, ' + sevenCount + ' sevens total in DB.');

          case 30:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchData(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// clean words of extraneous characters


// for each link we have, fetch the HTML it links to. Should return a post.
var fetchPosts = exports.fetchPosts = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(linksArray, config) {
    var _this = this;

    var posts;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Promise.all(linksArray.map(function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(link) {
                var data;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _axios2.default)(link, config);

                      case 2:
                        data = _context2.sent;
                        return _context2.abrupt('return', { link: link, data: data });

                      case 4:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }));

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 2:
            posts = _context3.sent;
            return _context3.abrupt('return', posts);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function fetchPosts(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

// create a post object from the HTML page of a missed connection


exports.initDatabase = initDatabase;
exports.checkStrings = checkStrings;
exports.parseText = parseText;
exports.parseLinks = parseLinks;
exports.createPostObject = createPostObject;
exports.getDatetime = getDatetime;
exports.getPostAttrs = getPostAttrs;
exports.getPostLocation = getPostLocation;
exports.getPostCity = getPostCity;
exports.getPostBorough = getPostBorough;
exports.getPostTitle = getPostTitle;
exports.getPostCategory = getPostCategory;
exports.getPostId = getPostId;
exports.getPostText = getPostText;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cheerio2 = require('cheerio');

var _cheerio3 = _interopRequireDefault(_cheerio2);

var _syllable = require('syllable');

var _syllable2 = _interopRequireDefault(_syllable);

var _config = require('../shared/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var axiosConfig = {
  baseURL: _config.BASE_URL,
  method: 'get'
};

var $ = null; // Cheerio wrapper object

function initDatabase(db) {
  // keeping full posts, because why not?
  var posts = db.get('posts');

  // seperate collections for faster retreival and random haiku construction
  var fives = db.get('fives');
  var sevens = db.get('sevens');

  // clear database
  fives.drop();
  sevens.drop();
  posts.drop().then(function (success) {
    if (!success) throw new Error('Could not drop database');
    fetchData(db, false);
  });
}

function cleanWord(word) {
  if (!word) return '';
  var cleanWord = word.replace(/[()!,;:."]+/, '');
  return cleanWord;
}

// for each string received, count syllables starting at first word.
// if 5 or 7 are reached, add the resulting phrase to the database
function checkStrings(str, db, post) {
  var fives = db.get('fives');
  var sevens = db.get('sevens');
  var phrase = '';
  for (var i = 0; i < str.length; i++) {
    var newWord = cleanWord(str[i]);
    if ((0, _syllable2.default)(newWord) > 0) {
      // eliminates numbers, unfortunately.
      phrase = phrase.concat(' ' + newWord).trim();
      if ((0, _syllable2.default)(phrase) < 8) {
        if ((0, _syllable2.default)(phrase) === 5) {
          // console.log(`5: ${phrase}`)
          fives.insert({ 'text': phrase, 'post': post });
        } else if ((0, _syllable2.default)(phrase) === 7) {
          // console.log(`7: ${phrase}`)
          sevens.insert({ 'text': phrase, 'postId': post });
          return;
        }
      } else {
        return;
      }
    }
  }
}

// for each word, create a substring from its position to the end
// of the string. send that to "checkStrings" to look for syllable
// patterns
function parseText(set, db) {
  set.forEach(function (post) {
    post.text.forEach(function (str) {
      var sentences = str.split('.');
      sentences.forEach(function (sentence, index) {
        var splitStr = sentence.split(' ');
        splitStr.forEach(function (str, i) {
          var readString = splitStr.slice(i, splitStr.length);
          checkStrings(readString, db, post);
        });
      });
    });
  });
}

// get the <a> links from each of the posts on this page
function parseLinks(_cheerio, rootElement, yesterdayOnly) {
  var links = [];
  rootElement.map(function (i, row) {
    // if database has already been initiated, we only need yeseterday's posts
    var datetime = new Date(_cheerio(row).find('time').attr('datetime'));
    var today = new Date();
    var datetimeZero = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());
    var todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var absDiff = (todayZero.getTime() - datetimeZero.getTime()) / (1000 * 60 * 60 * 24);

    var link = _cheerio(row).find('a').attr('href');
    if (yesterdayOnly) {
      if (absDiff === 1) {
        // posts from yesterday
        link && links.push(link);
      }
    } else {
      link && links.push(link);
    }
  });
  return links;
}function createPostObject(data, link) {
  var c$ = _cheerio3.default.load(data);
  var breadcrumbs = c$('.breadcrumbs');
  var postingTitleText = c$('.postingtitletext');
  var postInfos = c$('.postinginfos');

  var thisPost = {
    'city': getPostCity(breadcrumbs),
    'dateTime': getDatetime(postInfos),
    'attrs': getPostAttrs(c$),
    'location': getPostLocation(postingTitleText),
    'borough': getPostBorough(breadcrumbs),
    'title': getPostTitle(postingTitleText),
    'category': getPostCategory(postingTitleText),
    'postId': getPostId(c$, postInfos),
    'text': getPostText(c$),
    'link': _config.BASE_URL.concat(link)
  };
  return thisPost;
}

function getDatetime(selection) {
  var timeElement = selection.find('time');
  return timeElement && timeElement.attr('datetime');
}

function getPostAttrs(c$) {
  var attrs = {};
  c$('.mapAndAttrs').filter(function (i, node) {
    var hit = c$(node).find('span b');
    if (hit.length > 0) {
      hit.map(function (i, attr) {
        var str = c$(attr).parent().text();
        if (str.includes(':')) {
          var splitStr = str.split(': ');
          var key = splitStr[0].trim();
          var value = splitStr[1].trim();
          attrs[key] = value;
        }
      });
    }
  });
  return attrs;
}

function getPostLocation(selection) {
  var location = selection.find('small').text().trim();
  var cleaned = location.replace(/\W+/g, '');
  return cleaned;
}

function getPostCity(selection) {
  var city = selection.find('.area a');
  return city && city.text().trim();
}

function getPostBorough(selection) {
  var borough = selection.find('.subarea a');
  return borough && borough.text().trim();
}

function getPostTitle(selection) {
  var title = selection.find('#titletextonly');
  return title && title.text().trim();
}

function getPostCategory(selection) {
  if (!selection[0]) return;
  var textNode = selection[0].children.filter(function (node) {
    return node.type === 'text' && node.data && node.data.includes(' - ');
  });
  return textNode[0] && textNode[0].data.split(' - ')[1];
}

function getPostId(c$, selection) {
  var idNode = selection.children().filter(function (i, node) {
    return c$(node).text().includes('id');
  });
  return idNode && idNode.text().split(': ')[1];
}

function getPostText(c$) {
  var fullText = [];
  var text = c$('#postingbody').text();
  var textArray = text.trim().split('\n');
  textArray.forEach(function (str) {
    var cleanStr = str.trim();
    if (cleanStr.length > 0 && !cleanStr.startsWith('QR')) {
      fullText.push(cleanStr);
    }
  });
  return fullText;
}
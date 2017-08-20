'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHeart = createHeart;
exports.centerText = centerText;
var outros = exports.outros = {
  '0': {
    axis: 'x',
    top: -100,
    bottom: 100
  },
  '1': {
    axis: 'x',
    top: 100,
    bottom: 100
  },
  '2': {
    axis: 'y',
    top: -50,
    bottom: 50
  },
  '3': {
    axis: 'y',
    top: 50,
    bottom: -50
  }
};

function createHeart() {
  var heart = document.createElement('div');
  heart.id = 'heart';
  document.getElementById('haiku-placeholder').appendChild(heart);
}

function centerText() {
  document.getElementById('wrapper').style.height = window.innerHeight + 'px';
}
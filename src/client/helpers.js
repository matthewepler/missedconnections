// settings for animating first and last lines of text
export const outros = {
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
}

// beating heart animation element
export function createHeart () {
  const heart = document.createElement('div')
  heart.id = 'heart'
  document.getElementById('haiku-placeholder').appendChild(heart)
}

// re-positions text at center of screen when resized event occurs
export function centerText () {
  document.getElementById('wrapper').style.height = window.innerHeight + 'px'
}

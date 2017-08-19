const syllable = require('syllable')

function cleanWord (word) {
  if (!word) return ''
  var cleanWord = word.replace(/[()!,;:.]/, '')
  return cleanWord
}

function checkStrings (str) {
  var phrase = ''
  for (var i = 0; i < str.length; i++) {
    phrase = phrase.concat(` ${cleanWord(str[i])}`).trim()
    console.log(phrase, syllable(phrase))
    if (syllable(phrase) < 8) {
      if (syllable(phrase) === 5) {
        console.log(`5: ${phrase}`)
      } else if (syllable(phrase) === 7) {
        console.log(`7: ${phrase}`)
        return
      }
    } else {
      return
    }
  }
}

function parseText (set, db) {
  set.forEach(post => {
    post.forEach(str => {
      var splitStr = str.split(' ')

      for (var i = 0; i < splitStr.length; i++) {
        const readString = splitStr.slice(i, splitStr.length)
        checkStrings(readString)
      }

      // while we are less the length of the string
      // count and add syllables for each word, add the word to a phrase
      // if syllable total of phrase < 7, continue, else clear phrase and go to next word
      // if syllable total of pharse === 5, save the phrase to the database, continue
      // if syllable total of phrase === 7, save to the database and continue at next word in string
    })
  })
}

parseText([
  ['Do you wonder if many stars hang brightly on the sky',
    'Or if I will come to save you in the day time',
    'How long will you be sad for me',
    'Suns are up and moons are down']
])

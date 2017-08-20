import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import axios from 'axios'
import anime from 'animejs'

import { API_BASE_URL, BUILD_URL } from '../shared/config'
import { centerText, createHeart, outros } from './helpers'

class App extends Component {
  constructor () {
    super()
    this.state = {
      status: 'loading'
    }
  }

  componentDidMount () {
    this.fetchHaiku()
    centerText()
    window.addEventListener('resize', () => {
      centerText()
    })
  }

  async fetchHaiku () {
    const data = await axios.get(API_BASE_URL.concat(BUILD_URL))
    this.setState({
      status: 'loaded'
    })
    this.buildHaiku(data)
  }

  buildHaiku (data) {
    const haikuDiv =
      `<div class='haiku'>
        <p class='haiku-text one'>${data.data.one.text}</p>
        <p class='haiku-text two'>${data.data.two.text}</p>
        <p class='haiku-text three'>${data.data.three.text}</p>
      </div>`

    document.getElementById('haiku-placeholder').innerHTML = haikuDiv
    this.setAnimations()
  }

  destroyHaiku () {
    this.paragraphAnimation && delete this.paragraphAnmiation
    this.oneAnimation && delete this.oneAnimation
    this.threeAnimation && delete this.threeAnimation

    if (this.state.status !== 'loading') {
      const placeholder = document.getElementById('haiku-placeholder')
      while (placeholder.lastChild) {
        placeholder.removeChild(placeholder.lastChild)
      }
    }
  }

  setAnimations () {
    // const roll = 2 // 2 = heart
    const roll = parseInt(Math.random() * 4)
    const dir = outros[roll] // see helpers.js

    this.paragraphAnimation = anime({
      targets: '.haiku',
      opacity: 0,
      duration: 4000,
      delay: 5000,
      easing: 'easeOutCubic',
      complete: (anim) => {
        if (roll === 2) {
          createHeart() // see helpers.js
          setTimeout(() => {
            this.destroyHaiku()
            this.fetchHaiku()
          }, 2000)
        } else {
          this.destroyHaiku()
          this.fetchHaiku()
        }
      }
    })

    let animeProps = {}
    if (dir.axis === 'x') {
      animeProps.top = { translateX: dir.top }
      animeProps.bottom = { translateX: dir.bottom }
    } else {
      animeProps.top = { translateY: dir.top }
      animeProps.bottom = { translateY: dir.bottom }
    }

    this.oneAnimation = anime(Object.assign({}, animeProps.bottom, {
      targets: '.one',
      duration: 5000,
      delay: 3000,
      easing: 'easeInSine'
    }))
    this.threeAnimation = anime(Object.assign({}, animeProps.top, {
      targets: '.three',
      duration: 5000,
      delay: 3000,
      easing: 'easeInSine'
    }))
  }

  render () {
    return (
      <div id='wrapper' className='app-wrapper'>
        {this.state.status === 'loading'
          ? <div id='loading'>Loading...</div>
          : <div id='haiku-placeholder' />
        }
      </div>
    )
  }
}

export default App

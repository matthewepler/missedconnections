// @flow

import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import axios from 'axios'
import cheerio from 'cheerio'

import { BASE_URL, SEARCH_ROOT, SEARCH_URL } from '../shared/config'
import { createPostObject, fetchPosts, parseLinks } from './helpers'

class App extends Component<{}> {
  constructor () {
    super()
    this.state = {
      status: 'loading',
      errorMsg: ''
    }
    // XMLHttp Requests (Axios)
    this.axiosConfig = {
      baseURL: BASE_URL,
      method: 'get'
    }
    this.searchParams = {s: 0}

    // HTML scraping (Cheerio)
    this.$ = null
    this.links = []
  }
  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    axios(SEARCH_URL, Object.assign({}, this.axiosConfig, this.searchParams))
      .then(resp => {
        // if response code error, report error
        if (resp.status !== 200) throw new Error('Host response error')

        // if no elements match critieria, report error
        this.$ = cheerio.load(resp.data)
        const rootElement = this.$(SEARCH_ROOT)
        if (!rootElement || rootElement.length <= 0) throw new Error('No root element found')
        return rootElement
      }).then(rootElement => {
        // get and save <a> links from HTML, returns array of strings
        const links = parseLinks(this.$, rootElement)
        if (!links || links.length <= 0) throw new Error('No links were found')
        return links
      }).then(links => {
        // create XMLHttp requests for each link
        fetchPosts(links, this.axiosConfig).then(posts => {
          let collection = []
          if (!posts || posts.length <= 0) throw new Error('Unable to retrieve posts')
          posts.forEach(post => {
            if (post.status !== 200) throw new Error('Unexpected result from Craigslist')
            const thisPost = createPostObject(post.data)
            collection.push(thisPost)
          })
          return collection
        }).then(collection => {
          // console.log(textResults)
          // find 7 - syllable
        })
      })
      .catch(err => {
        console.log('Axios', err)
        this.UIError(err.message)
        return false
      })
  }

  UIError (errorMsg) {
    this.setState({ status: false, errorMsg }) // update UI so user is aware and can attempt refresh
  }

  findLines () {
    // get the first link and look for any lines
    // add lines to bin (7 or 5)
  }

  buildHaiku () {

  }

  renderAlertDiv () {
    if (this.state.status === false) {
      return (<div>{`${this.state.errorMsg}. Try refreshing or contact support.`}</div>)
    } else if (this.state.status === 'loading') {
      return (<div>Loading...</div>)
    }
  }

  render () {
    return (
      <div>
        {this.state.status === 'loading' ? <div>Loading...</div> : ''}

        <div>haiku here</div>

        {!this.state.status ? <div>{`${this.state.errorMsg}. Try refreshing or contact support.`}</div> : ''}
      </div>
    )
  }
}

export default App

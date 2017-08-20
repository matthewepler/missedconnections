import axios from 'axios'
import cheerio from 'cheerio'
import syllable from 'syllable'

import { BASE_URL, SEARCH_ROOT, SEARCH_URL } from '../shared/config'

const axiosConfig = {
  baseURL: BASE_URL,
  method: 'get'
}

let $ = null // Cheerio wrapper object

export function initDatabase (db) {
  // keeping full posts, because why not?
  const posts = db.get('posts')

  // seperate collections for faster retreival and random haiku construction
  const fives = db.get('fives')
  const sevens = db.get('sevens')

  // clear database
  fives.drop()
  sevens.drop()
  posts.drop().then(success => {
    if (!success) throw new Error('Could not drop database')
    fetchData(db, false)
  })
}

export async function fetchData (db, yesterdayOnly, searchParams) {
  // yesterdayOnly (boolean) - true will return only yesterday's posts, false will return
  // first 120. Use searchParams object to increase pagination
  const resp = await axios(SEARCH_URL, Object.assign({}, axiosConfig, searchParams))
  if (resp.status !== 200) throw new Error('Host response error')

  // load HTML data into Cheerio object
  $ = cheerio.load(resp.data)
  const rootElement = $(SEARCH_ROOT)
  if (!rootElement || rootElement.length <= 0) throw new Error('No root element found')

  // get and save <a> links from HTML, returns array of strings
  const links = parseLinks($, rootElement, yesterdayOnly)
  if (!links || links.length <= 0) throw new Error('No links were found')

  // create XMLHttp requests for each link
  const posts = await fetchPosts(links, axiosConfig)
  if (!posts || posts.length <= 0) throw new Error('Unable to retrieve posts')

  let postObjects = []
  posts.forEach(post => {
    if (post.data.status !== 200) throw new Error('Unexpected result from Craigslist')
    // create a data object based on the returned HTML data
    const thisPost = createPostObject(post.data.data, post.link)
    thisPost && postObjects.push(thisPost)
  })

  // insert results into database
  const postsCollection = db.get('posts')
  postObjects.forEach(post => {
    postsCollection.insert({post})
  })
  // feedback in terminal of scraping success
  console.log(`${postObjects.length} posts inserted`)

  // look for phrases that have syllable pattern matching haiku style
  parseText(postObjects, db)

  // feedback in terminal of scraping success
  const fiveCount = await db.get('fives').count()
  const sevenCount = await db.get('sevens').count()
  console.log(`${fiveCount} fives inserted. ${sevenCount} sevens inserted`)
}

// clean words of extraneous characters
function cleanWord (word) {
  if (!word) return ''
  var cleanWord = word.replace(/[()!,;:.]+/, '')
  return cleanWord
}

// for each string received, count syllables starting at first word.
// if 5 or 7 are reached, add the resulting phrase to the database
export function checkStrings (str, db, post) {
  const fives = db.get('fives')
  const sevens = db.get('sevens')
  let phrase = ''
  for (let i = 0; i < str.length; i++) {
    let newWord = cleanWord(str[i])
    if (syllable(newWord) > 0) {
      phrase = phrase.concat(` ${newWord}`).trim()
      if (syllable(phrase) < 8) {
        if (syllable(phrase) === 5) {
          // console.log(`5: ${phrase}`)
          fives.insert({'text': phrase, 'post': post})
        } else if (syllable(phrase) === 7) {
          // console.log(`7: ${phrase}`)
          sevens.insert({'text': phrase, 'postId': post})
          return
        }
      } else {
        return
      }
    }
  }
}

// for each word, create a substring from its position to the end
// of the string. send that to "checkStrings" to look for syllable
// patterns
export function parseText (set, db) {
  set.forEach(post => {
    post.text.forEach(str => {
      const sentences = str.split('.')
      sentences.forEach((sentence, index) => {
        const splitStr = sentence.split(' ')
        splitStr.forEach((str, i) => {
          const readString = splitStr.slice(i, splitStr.length)
          checkStrings(readString, db, post)
        })
      })
    })
  })
}

// get the <a> links from each of the posts on this page
export function parseLinks (_cheerio, rootElement, yesterdayOnly) {
  const links = []
  rootElement.map((i, row) => {
    // if database has already been initiated, we only need yeseterday's posts
    const datetime = new Date(_cheerio(row).find('time').attr('datetime'))
    const today = new Date()
    const datetimeZero = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate())
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const absDiff = (todayZero.getTime() - datetimeZero.getTime()) / (1000 * 60 * 60 * 24)

    const link = _cheerio(row).find('a').attr('href')
    if (yesterdayOnly) {
      if (absDiff === 1) { // posts from yesterday
        link && links.push(link)
      }
    } else {
      link && links.push(link)
    }
  })
  return links
}

// for each link we have, fetch the HTML it links to. Should return a post.
export async function fetchPosts (linksArray, config) {
  const posts = await Promise.all(linksArray.map(async (link) => {
    const data = await axios(link, config)
    return {link, data}
  }))
  return posts
}

// create a post object from the HTML page of a missed connection
export function createPostObject (data, link) {
  const c$ = cheerio.load(data)
  const breadcrumbs = c$('.breadcrumbs')
  const postingTitleText = c$('.postingtitletext')
  const postInfos = c$('.postinginfos')

  let thisPost = {
    'city': getPostCity(breadcrumbs),
    'dateTime': getDatetime(postInfos),
    'attrs': getPostAttrs(c$),
    'location': getPostLocation(postingTitleText),
    'borough': getPostBorough(breadcrumbs),
    'title': getPostTitle(postingTitleText),
    'category': getPostCategory(postingTitleText),
    'postId': getPostId(c$, postInfos),
    'text': getPostText(c$),
    'link': BASE_URL.concat(link)
  }
  return thisPost
}

export function getDatetime (selection) {
  const timeElement = selection.find('time')
  return timeElement && timeElement.attr('datetime')
}

export function getPostAttrs (c$) {
  let attrs = {}
  c$('.mapAndAttrs').filter((i, node) => {
    const hit = c$(node).find('span b')
    if (hit.length > 0) {
      hit.map((i, attr) => {
        const str = c$(attr).parent().text()
        if (str.includes(':')) {
          const splitStr = str.split(': ')
          const key = splitStr[0].trim()
          const value = splitStr[1].trim()
          attrs[key] = value
        }
      })
    }
  })
  return attrs
}

export function getPostLocation (selection) {
  const location = selection.find('small').text().trim()
  const cleaned = location.replace(/\W+/g, '')
  return cleaned
}

export function getPostCity (selection) {
  const city = selection.find('.area a')
  return city && city.text().trim()
}

export function getPostBorough (selection) {
  const borough = selection.find('.subarea a')
  return borough && borough.text().trim()
}

export function getPostTitle (selection) {
  const title = selection.find('#titletextonly')
  return title && title.text().trim()
}

export function getPostCategory (selection) {
  if (!selection[0]) return
  const textNode = selection[0].children.filter(node => {
    return node.type === 'text' && node.data && node.data.includes(' - ')
  })
  return textNode[0] && textNode[0].data.split(' - ')[1]
}

export function getPostId (c$, selection) {
  const idNode = selection.children().filter((i, node) => {
    return c$(node).text().includes('id')
  })
  return idNode && idNode.text().split(': ')[1]
}

export function getPostText (c$) {
  let fullText = []
  const text = c$('#postingbody').text()
  const textArray = text.trim().split('\n')
  textArray.forEach(str => {
    const cleanStr = str.trim()
    if (cleanStr.length > 0 && !cleanStr.startsWith('QR')) {
      fullText.push(cleanStr)
    }
  })
  return fullText
}

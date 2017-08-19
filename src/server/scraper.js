import axios from 'axios'
import cheerio from 'cheerio'
import syllable from 'syllable'

import { BASE_URL, SEARCH_ROOT, SEARCH_URL } from '../shared/config'

const axiosConfig = {
  baseURL: BASE_URL,
  method: 'get'
}
const searchParams = {s: 0}
let $ = null // cheerio wrapper object

export function initDatabase (db) {
  const posts = db.get('posts')
  // seperate lines into 5 and 7 syllable collections
  // faster retreival for random haiku construction by
  // eliminating need to filter by syllable count
  const fives = db.get('fives')
  const sevens = db.get('sevens')

  fives.drop()
  sevens.drop()
  posts.drop().then(success => {
    if (!success) throw new Error('Could not drop database')
    fetchData(db, false) // true will return only yesterday's posts
  })
}

async function fetchData (db, yesterdayOnly) {
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

  console.log(`${postObjects.length} posts inserted`)

  // look for phrases that have syllable pattern matching haiku style
  parseText(postObjects, db)

  const fiveCount = await db.get('fives').count()
  const sevenCount = await db.get('sevens').count()
  console.log(`${fiveCount} fives inserted. ${sevenCount} sevens inserted`)
}

function cleanWord (word) {
  if (!word) return ''
  var cleanWord = word.replace(/\(\)!,;:\./, '')
  return cleanWord
}

export function checkStrings (str, db, id) {
  const fives = db.get('fives')
  const sevens = db.get('sevens')
  let phrase = ''
  for (let i = 0; i < str.length; i++) {
    const newWord = cleanWord(str[i])
    if (syllable(newWord) > 0) {
      phrase = phrase.concat(` ${cleanWord(str[i])}`).trim()
      if (syllable(phrase) < 8) {
        if (syllable(phrase) === 5) {
          // console.log(`5: ${phrase}`)
          fives.insert({'text': phrase, 'postId': id})
        } else if (syllable(phrase) === 7) {
          // console.log(`7: ${phrase}`)
          sevens.insert({'text': phrase, 'postId': id})
          return
        }
      } else {
        return
      }
    }
  }
}

export function parseText (set, db) {
  set.forEach(post => {
    post.text.forEach(str => {
      const sentences = str.split('.')
      sentences.forEach((sentence, index) => {
        const splitStr = sentence.split(' ')
        splitStr.forEach((str, i) => {
          const readString = splitStr.slice(i, splitStr.length)
          checkStrings(readString, db, post.postId)
        })
      })
    })
  })
}

export function parseLinks (_cheerio, rootElement, yesterdayOnly) {
  const links = []
  rootElement.map((i, row) => {
    const datetime = new Date(_cheerio(row).find('time').attr('datetime'))
    // if database has already been initiated, we only need latest posts
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

export async function fetchPosts (linksArray, config) {
  const posts = await Promise.all(linksArray.map(async (link) => {
    const data = await axios(link, config)
    return {link, data}
  }))
  return posts
}

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

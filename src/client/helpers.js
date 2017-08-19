import axios from 'axios'
import cheerio from 'cheerio'

export function parseLinks (_cheerio, rootElement) {
  const links = []
  rootElement.map((i, row) => {
    const link = _cheerio(row).find('a').attr('href')
    link && links.push(link)
  })
  return links
}

export async function fetchPosts (linksArray, config) {
  const posts = await Promise.all(linksArray.map(link => axios(link, config)))
  return posts
}

export function createPostObject (data) {
  const c$ = cheerio.load(data)
  const breadcrumbs = c$('.breadcrumbs')
  const postingTitleText = c$('.postingtitletext')
  const postInfos = c$('.postinginfos')

  let thisPost = {
    city: getPostCity(breadcrumbs),
    dateTime: getDatetime(postInfos),
    attrs: getPostAttrs(c$),
    location: getPostLocation(postingTitleText),
    borough: getPostBorough(breadcrumbs),
    title: getPostTitle(postingTitleText),
    category: getPostCategory(postingTitleText),
    postId: getPostId(c$, postInfos),
    text: getPostText(c$)
  }
  console.log(thisPost)
}

function getDatetime (selection) {
  const timeElement = selection.find('time')
  return timeElement && timeElement.attr('datetime')
}

function getPostAttrs (c$) {
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

function getPostLocation (selection) {
  const location = selection.find('small').text().trim()
  const cleaned = location.replace(/\W+/g, '')
  return cleaned
}

function getPostCity (selection) {
  const city = selection.find('.area a')
  return city && city.text().trim()
}

function getPostBorough (selection) {
  const borough = selection.find('.subarea a')
  return borough && borough.text().trim()
}

function getPostTitle (selection) {
  const title = selection.find('#titletextonly')
  return title && title.text().trim()
}

function getPostCategory (selection) {
  const textNode = selection[0].children.filter(node => {
    return node.type === 'text' && node.data && node.data.includes(' - ')
  })
  return textNode[0] && textNode[0].data.split(' - ')[1]
}

function getPostId (c$, selection) {
  const idNode = selection.children().filter((i, node) => {
    return c$(node).text().includes('id')
  })
  return idNode && idNode.text().split(': ')[1]
}

function getPostText (c$) {
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

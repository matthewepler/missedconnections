import axios from 'axios'

export function parseLinks (_cheerio, rootElement) {
  const links = []
  rootElement.map((i, row) => {
    console.log(row)
    const link = _cheerio(row).find('a').attr('href')
    link && links.push(link)
  })
  return links
}

export async function fetchPosts (linksArray, config) {
  const posts = await Promise.all(linksArray.map(link => axios(link, config)))
  return posts
}

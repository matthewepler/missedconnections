import 'babel-polyfill'
import compression from 'compression'
import express from 'express'
import logger from 'morgan'
import mongo from 'mongodb' // eslint-disable-line no-unused-vars
import monk from 'monk'
import schedule from 'node-schedule'

import { MONGO_URL, MONGO_LOCAL_URL, STATIC_PATH, WEB_PORT } from '../shared/config' // eslint-disable-line no-unused-vars
import { isProd } from '../shared/util'
import { fetchData, initDatabase } from './scraper' // eslint-disable-line no-unused-vars

import routes from './routes'

// MongoDB Connection
const db = monk(MONGO_URL, (err) => {
  if (err) {
    console.log('Error connecting to database')
    return
  }
  console.log('connected to database')
})

// !isProd && initDatabase(db) // dumps existing data, use with extreme caution!!
schedule.scheduleJob('0 1 * * *', () => {
  // fetch new posts/haikus @ 1AM every night
  fetchData(db, true) // see scraper.js
})

const app = express()

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))
app.use(logger('dev'))

// add reference to MongoDB object to the request so we can access it in routes
app.use((req, res, next) => {
  req.db = db
  next()
})

app.use('/', routes)

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)'
    : '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`)
})

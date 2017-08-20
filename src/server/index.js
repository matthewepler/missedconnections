import compression from 'compression'
import express from 'express'
import logger from 'morgan'
import mongo from 'mongodb' // eslint-disable-line no-unused-vars
import monk from 'monk'
import schedule from 'node-schedule'

import { MONGO_URL, MONGO_LOCAL_URL, STATIC_PATH, WEB_PORT } from '../shared/config' // eslint-disable-line no-unused-vars
import { isProd } from '../shared/util'
import { fetchData, initDatabase } from './scraper'

import routes from './routes'

const db = monk('mongodb://heroku_mzstr9zt:qocn2phoi005km2nhs7sose15d@ds149603.mlab.com:49603/heroku_mzstr9zt')
!isProd && initDatabase(db) // dumps existing data!!
schedule.scheduleJob('0 1 * * *', () => {
  fetchData(db, true)
})

const app = express()

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))
app.use(logger('dev'))

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

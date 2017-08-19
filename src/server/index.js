// @flow

import compression from 'compression'
import express from 'express'
// import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongo from 'mongodb'
import monk from 'monk'

import { STATIC_PATH, WEB_PORT } from '../shared/config'
import { isProd } from '../shared/util'
import { initDatabase } from './scraper'

import routes from './routes'

const db = monk('localhost:27017/missed_connections')
!isProd && initDatabase(db) // dumps existing data!!

const app = express()

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use((req, res, next) => {
  req.db = db
  next()
})

app.use('/', routes)

// catch 404 and forwarding to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (!isProd) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)'
    : '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`)
})

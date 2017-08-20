if (process.env.NODE_ENV !== 'production') require('dotenv').config()

export const WEB_PORT = 5000
export const STATIC_PATH = '/static'
export const APP_NAME = 'Missed Connections Haiku App'

export const WDS_PORT = 7000
export const APP_CONTAINER_CLASS = 'js-app'
export const APP_CONTAINER_SELECTOR = `.${APP_CONTAINER_CLASS}`

export const BASE_URL = 'https://newyork.craigslist.org/'
export const SEARCH_URL = 'search/mis'
export const SEARCH_ROOT = '.result-row'

export const API_BASE_URL = `http://localhost:5000`
export const BUILD_URL = '/build'

export const MONGO_USERNAME = process.env.MONGO_USERNAME
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD
export const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@ds149603.mlab.com:49603/heroku_mzstr9zt`
export const LOCAL_MONGO_URL = `localhost:27017/missed_connections`

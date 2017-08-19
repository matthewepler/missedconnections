import { APP_NAME } from '../../shared/config'
import renderApp from '../render-app'

import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.send(renderApp(APP_NAME))
})

/* Show all data */
router.get('/list/:collection', (req, res) => {
  const db = req.db
  const collection = db.get(req.params.collection)
  collection.find({}, {}, (e, docs) => {
    res.json(docs)
  })
})

router.get('/dump/:collection', (req, res) => {
  const db = req.db
  const collection = db.get(req.params.collection)

  collection.drop().then(success => {
    const msg = success
      ? `${req.params.collection} collection dumped successfully`
      : `unable to drop ${req.params.collection} collection`
    res.send(msg)
  })
})

export default router

import express from 'express'

import { APP_NAME, BUILD_URL } from '../../shared/config'
import renderApp from '../render-app'

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

router.get(BUILD_URL, async (req, res) => {
  // build a random haiku and send back JSON
  const db = req.db
  const fives = db.get('fives')
  const sevens = db.get('sevens')

  const randomFive1 = await fives.aggregate([{ $sample: { size: 1 } }])
  const randomSeven = await sevens.aggregate([{ $sample: { size: 1 } }])
  const randomFive2 = await fives.aggregate([{ $sample: { size: 1 } }])

  res.json({
    'one': randomFive1[0],
    'two': randomSeven[0],
    'three': randomFive2[0]
  })
})

export default router

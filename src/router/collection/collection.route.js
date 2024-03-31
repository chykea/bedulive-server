const Router = require('koa-router')
const router = new Router({ prefix: "/collection" })
const { setCollection, getCollections, removeCollection, getCollection } = require('../../controller/collection/index')
const { auth } = require('../../middleware/auth')

router.post('/addCollection', auth, setCollection)
router.get('/getCollections', auth, getCollections)
router.get('/removeCollection', auth, removeCollection)
router.get('/getCollection', auth, getCollection)

module.exports = router
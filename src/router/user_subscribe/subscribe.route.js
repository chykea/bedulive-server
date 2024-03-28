const { auth } = require('../../middleware/auth')
const { setSubscribe, getUserSubscribe, cancelSubscribe, getIsSubscribe } = require('../../controller/user_subscribe')
const Router = require('koa-router')
const router = new Router({ prefix: "/user_subscribe" })

router.post('/setSubscribe', auth, setSubscribe)
router.get('/getUserSubscribe', auth, getUserSubscribe)
router.get('/getIsSubscribe', auth, getIsSubscribe)
router.post('/cancelSubscribe', auth, cancelSubscribe)

module.exports = router
const errTransform = require('../../constanst/err.transform')
const { getUserLiveRoom, subscribeLiveRoom, unsubscribeLiveRoom, getSubscribeLiveRoom } = require('../../controller/live-student/index')
const { auth } = require('../../middleware/auth')

const Router = require('koa-router')
const router = new Router({ prefix: '/liveStudent' })

// 学生获取所有订阅直播间
router.get('/getUserLiveRoom', auth, getUserLiveRoom)
// 学生是否订阅了直播间
router.get('/isSubscribe', auth, getSubscribeLiveRoom)
// 学生订阅直播间
router.post('/subscribeLiveRoom', auth, subscribeLiveRoom)
// 学生取消订阅直播间
router.post('/unsubscribeLiveRoom', auth, unsubscribeLiveRoom)

module.exports = router
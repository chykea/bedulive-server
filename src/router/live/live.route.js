const Router = require('koa-router')
const { auth } = require('../../middleware/auth/index')
const { STREAM_URL, STREAM_SERVER, APP_URL } = require('../../config/config.default.js')
const errTransform = require('../../constanst/err.transform')
const { invalidAuth } = require('../../constanst/err.type')
const { getLiveList, getLiveRoom, setLiveInfo } = require('../../controller/live/index.js')

const router = new Router({ prefix: '/live' })

router.post('/setLiveInfo', auth, setLiveInfo)

router.get('/getPlayerURL', auth, async (ctx, next) => {
    const { roomId } = ctx.request.query;
    const { user } = ctx.state
    if (user.uid === roomId && user.identity === '1') {
        ctx.app.emit('error', errTransform(invalidAuth), ctx)
        return
    }
    ctx.body = {
        result: {
            stream_url: STREAM_URL + STREAM_SERVER + APP_URL + `/${roomId}`
        }
    }
})

router.get('/getPushURL', auth, (ctx, next) => {
    const { user } = ctx.state
    // 如果是学生则没有权限
    if (user.identity === '1') {
        ctx.app.emit('error', errTransform(invalidAuth), ctx)
        return
    }
    ctx.body = {
        code: '0',
        result: {
            stream_url: STREAM_URL + STREAM_SERVER + APP_URL + `/${user.uid}`
        }
    }
})

router.get('/getLiveList', getLiveList)

router.get('/getLiveRoom', auth, getLiveRoom)

module.exports = router
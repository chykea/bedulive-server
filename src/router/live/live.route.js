const Router = require('koa-router')
const { auth } = require('../../middleware/auth/index')
const { STREAM_URL, STREAM_SERVER, APP_URL } = require('../../config/config.default.js')
const { invalidAuth } = require('../../constanst/err.type')
const router = new Router({ prefix: '/live' })


router.get('/getPushURL', auth, (ctx, next) => {
    const { user } = ctx.state
    // console.log(user);
    // 如果是学生则没有权限
    if (user.identity === '1') {
        ctx.app.emit('error', invalidAuth, ctx)
        return
    }
    ctx.body = {
        code: '0',
        result: {
            stream_url: STREAM_URL + STREAM_SERVER + APP_URL + `/${user.uid}`
        }
    }
})

module.exports = router
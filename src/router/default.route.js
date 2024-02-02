const Router = require('koa-router')
// router 前缀
const router = new Router()

// GET /
router.all('/', (ctx, next) => {
    ctx.body = {
        code: '200',
        message: '默认服务正常'
    }
})

module.exports = router
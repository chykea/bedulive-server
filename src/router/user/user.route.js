const Router = require('koa-router')
const { login, register } = require('../../controller/user/index')
// router 前缀
const router = new Router({ prefix: '/users' })

// 
router.post('/login', login)
router.post('/register', register)

module.exports = router
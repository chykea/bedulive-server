const Router = require('koa-router')
const { userValidator, verifyUser, crpytPassword, verifyLogin } = require('../../middleware/user/index')
const { login, register } = require('../../controller/user/index')
// router 前缀
const router = new Router({ prefix: '/api/users' })

// 登录
router.post('/login', userValidator, verifyLogin, login)
// 经过中间件判断后，如果没有异常才会进行注册
router.post('/register', userValidator, verifyUser, crpytPassword, register)

module.exports = router
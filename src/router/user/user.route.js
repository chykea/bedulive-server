const Router = require('koa-router')
const { userValidator, verifyUser, crpytPassword, verifyLogin } = require('../../middleware/user/index')
const { auth } = require('../../middleware/auth/index')
const { login, register, getUser } = require('../../controller/user/index')
// router 前缀
const router = new Router({ prefix: '/users' })
// 经过中间件判断后
// 登录
router.post('/login', userValidator, verifyLogin, login)
// 注册
router.post('/register', userValidator, verifyUser, crpytPassword, register)
// 修改密码
router.post('/changePassword', auth, (ctx, next) => {
    console.log(ctx.state.user);
    ctx.body = { message: '修改成功' };
})
// 获取用户信息
router.get('/info', auth, getUser)


module.exports = router
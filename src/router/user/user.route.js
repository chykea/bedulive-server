const Router = require('koa-router')

const { userValidator, verifyUser, crpytPassword, verifyLogin, verifyOldPassword, vertifyHash } = require('../../middleware/user/index')
const { auth } = require('../../middleware/auth/index')
const { login, register, changePassword, changeInfo, uploadImage } = require('../../controller/user/index')
// router 前缀
const router = new Router({ prefix: '/users' })
// 经过中间件判断后
// 登录
router.post('/login', userValidator, verifyLogin, login)
// 注册
router.post('/register', userValidator, verifyUser, crpytPassword, register)
// 修改密码
router.post('/changePassword', auth, verifyOldPassword, crpytPassword, changePassword)
// 修改个人信息
router.post('/changeInfo', auth, changeInfo)

// 上传头像图片
router.post('/uploadAvatar', auth, uploadImage)


module.exports = router
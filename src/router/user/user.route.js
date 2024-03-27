const Router = require('koa-router')

const { userValidator, verifyUser, crpytPassword, verifyLogin, verifyOldPassword } = require('../../middleware/user/index')
const { auth } = require('../../middleware/auth/index')
const { login, register, changePassword, changeInfo, getAllUserList, banUser, unbanUser, updateUser } = require('../../controller/user/index')
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
// 管理员
// 获取用户列表
router.get('/list', auth, getAllUserList)
// 封禁用户
router.get('/ban', auth, banUser)
// 解封用户
router.all('/unbanUser', auth, unbanUser)

// router.all('/test', (ctx) => {
//     console.log('测试成功');
//     console.log(ctx.query.id);
//     ctx.body = '测试成功'
// })
// 更新用户
router.post('/update', auth, updateUser)


module.exports = router
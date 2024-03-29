const bcrypt = require('bcryptjs')
const { getUserInfo } = require('../../service/user/index')
const errTransform = require('../../constanst/err.transform')

const { userFormateError, userAlreadyExited, invalidPassword, userLoginError, userDoesNotExist } = require('../../constanst/err.type')


// 注册所用到的中间件
const userValidator = async (ctx, next) => {
    const { user_name, password } = ctx.request.body
    // 合法性
    if (!user_name || !password) {
        console.error('用户名或密码为空', ctx.request.body)
        // 抛出错误(如果要用这种方式抛出异常,不要用try-catch,会被捕获到)
        ctx.app.emit('error', errTransform(userFormateError), ctx)
        return
    }

    await next()
}
// 验证数据库是否有该用户
const verifyUser = async (ctx, next) => {
    const { user_name } = ctx.request.body
    // 需要await，不然返回的是一个Promise对象
    if (await getUserInfo({ user_name })) {
        ctx.app.emit('error', errTransform(userAlreadyExited), ctx)
        return
    }
    await next()
}

// 密码加密
const crpytPassword = async (ctx, next) => {
    const { password } = ctx.request.body

    const salt = bcrypt.genSaltSync(10) // 加盐
    // hash保存的是 密文
    const hash = bcrypt.hashSync(password, salt)

    ctx.request.body.password = hash

    await next()
}

// 登录
const verifyLogin = async (ctx, next) => {
    // 1. 判断用户是否存在(不存在:报错)
    const { user_name, password } = ctx.request.body


    // 获取用户
    const res = await getUserInfo({ user_name })
    if (!res) {
        console.error('用户名不存在', { user_name })
        ctx.app.emit('error', errTransform(userDoesNotExist), ctx)
        return
    }
    // 2. 密码是否匹配(不匹配: 报错)
    // 获取输入的密码与数据库中经过加盐加密处理的密码进行比对,compareSync会自动进行解密
    if (!bcrypt.compareSync(password, res.password)) {
        return ctx.app.emit('error', errTransform(invalidPassword), ctx)

    }
    await next()
}
// 验证旧密码是否正确
const verifyOldPassword = async (ctx, next) => {
    const { id } = ctx.state.user
    const { old_password } = ctx.request.body

    const res = await getUserInfo({ id })
    if (!bcrypt.compareSync(old_password, res.password)) {
        ctx.app.emit('error', errTransform(invalidPassword), ctx)
        return
    }
    await next()

}



module.exports = {
    userValidator,
    verifyUser,
    crpytPassword,
    verifyLogin,
    verifyOldPassword,
}
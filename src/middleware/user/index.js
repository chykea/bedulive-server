const bcrypt = require('bcryptjs')
const { getUserInfo } = require('../../service/user/index')
const { userFormateError, userAlreadyExited, invalidPassword, userLoginError } = require('../../constanst/err.type')

// 注册所用到的中间件
const userValidator = async (ctx, next) => {
    const { user_name, password } = ctx.request.body
    // 合法性
    if (!user_name || !password) {
        console.error('用户名或密码为空', ctx.request.body)
        // 抛出错误
        ctx.app.emit('error', userFormateError, ctx)
        return
    }

    await next()
}

const verifyUser = async (ctx, next) => {
    const { user_name } = ctx.request.body
    // 需要await，不然返回的是一个Promise对象
    if (await getUserInfo({ user_name })) {
        ctx.app.emit('error', userAlreadyExited, ctx)
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

    try {
        // 获取用户
        const res = await getUserInfo({ user_name })
        console.log(res);
        if (!res) {
            console.error('用户名不存在', { user_name })
            ctx.app.emit('error', userDoesNotExist, ctx)
            return
        }

        // 2. 密码是否匹配(不匹配: 报错)
        // 获取输入的密码与数据库中经过加盐加密处理的密码进行比对,compareSync会自动进行解密
        if (!bcrypt.compareSync(password, res.password)) {
            ctx.app.emit('error', invalidPassword, ctx)
            return
        }
    } catch (err) {
        console.error(err)
        return ctx.app.emit('error', userLoginError, ctx)
    }

    await next()
}
module.exports = {
    userValidator,
    verifyUser,
    crpytPassword,
    verifyLogin
}
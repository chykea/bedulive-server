const { createUser, getUserInfo } = require('../../service/user/index.js')

class UserController {
    async register(ctx, next) {
        // 1. 获取数据
        // 注册的时候没有昵称这个参数，需要额外的接口来对nick_name进行修改
        const { user_name, password } = ctx.request.body
        // 2. 操作数据库
        const res = await createUser(user_name, password)

        if (!user_name || !password) {
            console.error('用户名或密码为空', ctx.request.body)
            ctx.status = 400
            ctx.body = {
                code: '400',
                message: '用户名或密码为空',
                result: '',
            }
            return
        }

        // 合理性
        if (getUerInfo({ user_name })) {
            ctx.status = 409
            ctx.body = {
                code: '409',
                message: '用户已经存在',
                result: '',
            }
            return
        }
        // 3. 返回结果
        ctx.body = {
            code: '200',
            message: '用户注册成功',
            result: {
                id: res.id,
                user_name: res.user_name,
                nick_name: res.nick_name
            }
        }
    }

    async login(ctx, next) {
        ctx.body = '登录成功'
    }
}

module.exports = new UserController()
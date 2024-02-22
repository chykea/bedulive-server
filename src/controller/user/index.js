const { createUser, getUserInfo } = require('../../service/user/index.js')
const { JWT_SECRET } = require('../../config/config.default.js')
const jwt = require('jsonwebtoken')
const { v1: uuidv1 } = require('uuid')

class UserController {
    async register(ctx, next) {
        // 1. 获取数据
        // 注册的时候没有昵称这个参数，需要额外的接口来对nick_name进行修改
        const { user_name, password, identity } = ctx.request.body
        const uid = uuidv1()
        // console.log(uid);
        // 经过判断后
        // 2. 操作数据库
        const res = await createUser(uid, user_name, password, user_name, identity)
        // 3. 返回结果
        ctx.body = {
            code: 200,
            message: '用户注册成功',
            result: {
                // id: res.id,
                uid: res.uid,
                user_name: res.user_name,
                nick_name: res.nick_name,
                identity: res.identity
            }
        }
    }

    async login(ctx, next) {
        const { user_name } = ctx.request.body

        // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
        try {
            // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
            const { password, ...res } = await getUserInfo({ user_name })
            console.log(res);
            ctx.body = {
                code: 200,
                message: '用户登录成功',
                result: {
                    ...res,
                    token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
                },
            }
        } catch (err) {
            console.error('用户登录失败', err)
        }
    }
    async getUser(ctx, next) {
        const { user } = ctx.state
        const { id, password, ...res } = await getUserInfo(user.user_name)
        ctx.body = {
            code: 200,
            message: "查询成功",
            result: res
        }
    }
}

module.exports = new UserController()
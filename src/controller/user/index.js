const { createUser, getUserInfo, updateById, getAllUser } = require('../../service/user/index.js')
const { createLiveRoom } = require('../../service/live/index.js')
const { JWT_SECRET, SERVER_URL } = require('../../config/config.default.js')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

class UserController {
    async register(ctx, next) {
        // 1. 获取数据
        // 注册的时候没有昵称这个参数，需要额外的接口来对nick_name进行修改
        const { user_name, password, identity } = ctx.request.body
        const uid = uuidv4().replace(/-/g, '');
        // 经过判断后
        // 2. 操作数据库
        const res = await createUser(uid, user_name, password, user_name, identity)
        if (identity !== '1') {
            await createLiveRoom({ uid })
        }
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
        // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
        const { password, ...res } = await getUserInfo({ user_name })
        if (res.state === 1) {
            ctx.body = {
                code: 401,
                message: '登录失败,该用户已被封禁',
                result: null
            }
            return
        }
        ctx.body = {
            code: 200,
            message: '用户登录成功',
            result: {
                ...res,
                token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
            },
        }
    }
    async changePassword(ctx, next) {
        // 1. 获取数据
        const id = ctx.state.user.id
        const password = ctx.request.body.password
        if (password == '') {
            ctx.body = {
                code: '10008',
                message: '密码不能为空',
                result: '',
            }
            return
        }
        // 2. 操作数据库
        if (await updateById({ id, password })) {
            console.log('修改密码成功');
            ctx.body = {
                code: 0,
                message: '修改密码成功',
                result: '',
            }
        } else {
            ctx.body = {
                code: '10007',
                message: '修改密码失败',
                result: '',
            }
        }
    }
    async changeInfo(ctx, next) {
        const id = ctx.state.user.id
        const { ...info } = ctx.request.body
        if (await updateById({ id, ...info })) {
            const { password, ...res } = await getUserInfo({ id })
            ctx.body = {
                code: 0,
                message: '修改成功',
                result: res,
            }
        } else {
            ctx.body = {
                code: '10009',
                message: '修改失败',
                result: null,
            }
        }
    }
    async getAllUserList(ctx, next) {
        const { identity } = ctx.state.user
        if (identity !== '0') {
            ctx.body = {
                code: 401,
                message: '权限不足',
                res: null
            }
            return
        }
        const { page, pageSize } = ctx.query
        const { res, total } = await getAllUser({ page, pageSize })
        if (res) {
            ctx.body = {
                code: 200,
                message: '获取用户列表成功',
                res,
                total,
            }
            return
        }
        ctx.body = {
            code: 200,
            message: '获取用户列表成功',
            total: 0,
            res: []
        }

    }
    async banUser(ctx, next) {
        const { identity } = ctx.state.user
        const { id } = ctx.query
        if (identity !== '0') {
            ctx.body = {
                code: 401,
                message: '权限不足',
                res: null
            }
            return
        }
        if (await updateById({ id, state: 1 })) {
            ctx.body = {
                code: 200,
                message: '封禁成功',
                res: null
            }
            return
        }
        ctx.body = {
            code: 500,
            message: '封禁失败',
            res: null
        }
    }
    async unbanUser(ctx, next) {
        const { identity } = ctx.state.user
        const { id } = ctx.query
        if (identity !== '0') {
            ctx.body = {
                code: 401,
            }
            return
        }
        if (await updateById({ id, state: 0 })) {
            ctx.body = {
                code: 200,
                message: '解封成功',
                res: null
            }
            return
        }
        ctx.body = {
            code: 500,
            message: '解封失败',
            res: null
        }
    }
    async updateUser(ctx, next) {
        const { identity: i } = ctx.state.user
        if (i !== '0') {
            ctx.body = {
                code: 401,
                message: '权限不足',
                res: null
            }
            return
        }
        const { id, identity } = ctx.request.body
        if (await updateById({ id, identity })) {
            ctx.body = {
                code: 200,
                message: '修改成功',
                res: null
            }
            return
        }
        ctx.body = {
            code: 500,
            message: '修改失败',
            res: null
        }
    }
}

module.exports = new UserController()
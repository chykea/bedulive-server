const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../../config/config.default')

const { tokenExpiredError, invalidToken } = require('../../constanst/err.type.js')

const auth = async (ctx, next) => {
    let { authorization } = ctx.request.header
    // 
    authorization = authorization || ''
    const token = authorization.replace('Bearer ', '')
    // console.log(token)

    try {
        // user中包含了payload的信息(id, user_name, is_admin)
        const user = jwt.verify(token, JWT_SECRET)
        // 通过state传给下个中间件处理
        ctx.state.user = user
    } catch (err) {
        switch (err.name) {
            case 'TokenExpiredError':
                console.error('token已过期', err)
                return ctx.app.emit('error', tokenExpiredError, ctx)
            case 'JsonWebTokenError':
                console.error('无效的token', err)
                return ctx.app.emit('error', invalidToken, ctx)
        }
    }

    await next()
}

module.exports = {
    auth,
}
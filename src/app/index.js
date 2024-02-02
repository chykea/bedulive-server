const Koa = require('koa')
const { koaBody } = require('koa-body')

const defaultRouter = require('../router/default.route')
const userRouter = require('../router/user/user.route.js')

const errHandler = require('./status/index.js')
const app = new Koa()

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    // ctx.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    await next();
})

app.use(koaBody())

app.use(defaultRouter.routes())
app.use(userRouter.routes())

// 监听错误
app.on('error', errHandler)

module.exports = app
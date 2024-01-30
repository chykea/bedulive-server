const Koa = require('koa')
const { koaBody } = require('koa-body')

const defaultRouter = require('../router/default.route')
const userRouter = require('../router/user/user.route.js')

const errHandler = require('./status/index.js')
const app = new Koa()

app.use(koaBody())

app.use(defaultRouter.routes())
app.use(userRouter.routes())

// 监听错误
app.on('error', errHandler)

module.exports = app
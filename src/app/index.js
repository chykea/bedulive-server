const Koa = require('koa')
const { koaBody } = require('koa-body')

const defaultRouter = require('../router/default.route')
const userRouter = require('../router/user/user.route.js')
const app = new Koa()

app.use(koaBody())

app.use(defaultRouter.routes())
app.use(userRouter.routes())


module.exports = app
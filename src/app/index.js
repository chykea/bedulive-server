const Koa = require('koa')
const cors = require('koa2-cors')
const { koaBody } = require('koa-body')

const defaultRouter = require('../router/default.route')
const userRouter = require('../router/user/user.route.js')
const liveRouter = require('../router/live/live.route.js')
const articleRouter = require('../router/article/article.route.js')

const errHandler = require('./status/index.js')
const app = new Koa()

const server = require('http').createServer(app.callback());
const io = require('../socket')(server)

// console.log(io);

app.use(cors())
/* app.use(async (ctx, next) => {

    ctx.set("Access-Control-Allow-Origin", "*");
    // 允许哪些请求方式
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT ,OPTIONS');
    // 浏览器在发送跨域请求并且包含自定义 header 字段时，浏览器会先向服务器发送 OPTIONS 预检请求（preflight request），探测该请求服务是否允许自定义跨域字段。
    // 如果允许，则继续执行 POST、GET请求，否则返回提示错误。

    // 允许有哪些请求头
    // Content-Type: 一般来讲，这个字段是不用特地去声明
    // (因为一般它的值在application/x-www-form-urlencoded, multipart/form-data 或 text/plain中,
    // 但是出现了其他的值(application/json; charset=utf-8)就需要声明一下了)
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    ctx.set("Access-Control-Allow-Credentials", "true"); // 允许客户端携带请求凭证(token/cookie)
    // 预检请求通过后,在一定时间内不用再发起预检请求了
    ctx.set("Access-Control-Max-Age", 300);
    // 如果是预检请求,检查当前请求是否符合服务器的cors配置，如果符合，则再发出真正的请求。如果不符合，则直接返回跨域报错。
    if (ctx.request.method === 'OPTIONS') {
        // 这里的处理是直接响应数据
        ctx.body = 200
    }

    // ctx.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    await next();
}) */

app.use(koaBody())

app.use(defaultRouter.routes())
app.use(userRouter.routes())
app.use(liveRouter.routes())
app.use(articleRouter.routes())

// 监听错误
app.on('error', errHandler)
// console.log('koa', app);
// console.log('httpServer', server);
module.exports = server
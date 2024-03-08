const Router = require('koa-router')
const { auth } = require('../middleware/auth/index')
const { vertifyHash, mergeFile, uploadFile } = require('../middleware/file/index')
// router 前缀
const router = new Router()

// GET /
router.all('/', (ctx, next) => {
    ctx.body = {
        code: '200',
        message: '默认服务正常'
    }
})
// 判断是否需要上传
router.post('/vertifyUpload', auth, vertifyHash)
// 上传文件切片
router.post('/uploadChunk', auth, uploadFile)
// 合并文件
router.post('/mergeFile', auth, mergeFile)

module.exports = router
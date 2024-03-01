const Router = require('koa-router')
const { auth } = require('../../middleware/auth/index')
const { addArticle, getAllArticleByUID } = require('../../controller/article/index')
const router = new Router({ prefix: '/article' })

// 发布文章
router.post('/publish', auth, addArticle)
router.get('/getArticleByUID', auth, getAllArticleByUID)
module.exports = router
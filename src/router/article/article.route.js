const Router = require('koa-router')
const { auth } = require('../../middleware/auth/index')
const { addArticle, getAllArticleByUID, getAllArticle, getDetail, deleteArticle } = require('../../controller/article/index')
const router = new Router({ prefix: '/article' })

// 发布文章
router.post('/publish', auth, addArticle)
// 获取文章
router.get('/getUserArticle', auth, getAllArticleByUID)
router.get('/getAllArticle', getAllArticle)
router.get('/getArticleDetail', getDetail)
// 删除文章
router.get('/deleteArticle', auth, deleteArticle)
module.exports = router
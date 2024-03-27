const Router = require('koa-router')
const { auth } = require('../../middleware/auth/index')
const {
    addArticle,
    getAllArticleByUID,
    getAllArticle,
    getDetail,
    deleteArticle,
    updatedUserArticle,
    comments,
    deleteComments,
    searchArticle,
    lockArticle,
    unlockArticle
} = require('../../controller/article/index')

const router = new Router({ prefix: '/article' })

// 发布文章
router.post('/publish', auth, addArticle)
// 获取文章
router.get('/getUserArticle', auth, getAllArticleByUID)
router.get('/getAllArticle', getAllArticle)
router.get('/getArticleDetail', getDetail)
// 更新文章
router.post('/updateArticle', auth, updatedUserArticle)
// 删除文章
router.get('/deleteArticle', auth, deleteArticle)
// 搜索文章
router.post('/searchArticle', auth, searchArticle)

// 发布评论
router.post('/comment', auth, comments)
// 回复评论
router.post('/reply', auth, comments)
// 删除评论
router.get('/delete', auth, deleteComments)

// 锁定文章
router.get('/lock', auth, lockArticle)
// 解锁文章
router.get('/unlock', auth, unlockArticle)

module.exports = router
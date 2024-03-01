const { createArticle, getArticleDetail, getArticleList, deleteArticle } = require('../../service/article/index')
class ArticleController {
    async addArticle(ctx, next) {
        const { uid, user_name: author } = ctx.state.user
        const { title, content } = ctx.request.body
        const res = await createArticle({ uid, author, title, content })
        if (res) {
            ctx.body = {
                code: '0',
                message: '发布成功'
            }
            return
        }
        ctx.body = {
            code: '1',
            message: '发布失败'
        }
    }
    async getAllArticleByUID(ctx, next) {
        const { uid } = ctx.state.user
        const res = await getArticleList({ uid })
        ctx.body = {
            code: '0',
            message: '获取成功',
            data: res
        }
    }
}

module.exports = new ArticleController()
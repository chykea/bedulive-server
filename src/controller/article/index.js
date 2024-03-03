const { createArticle, getArticleDetail, getArticleList, getAllArticleList, deleteArticleByID, updateArticle } = require('../../service/article/index')
class ArticleController {
    async addArticle(ctx, next) {
        const { uid, nick_name: author } = ctx.state.user
        const { title, content, digest } = ctx.request.body
        const res = await createArticle({ uid, author, title, content, digest })
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
        const { page } = ctx.query
        const res = await getArticleList({ uid, page })
        ctx.body = {
            code: '0',
            message: '获取成功',
            res
        }
    }
    async getAllArticle(ctx, next) {
        const { page } = ctx.query
        const res = await getAllArticleList({ page })

        ctx.body = {
            code: '0',
            message: '获取成功',
            res
        }
    }
    async getDetail(ctx, next) {
        const { id } = ctx.query
        const res = await getArticleDetail({ id })
        ctx.body = {
            code: '0',
            message: '获取成功',
            res
        }
    }
    async deleteArticle(ctx, next) {
        const { id } = ctx.query
        const { uid } = ctx.state.user
        const res = await deleteArticleByID({ id, uid })
        if (res) {
            ctx.body = {
                code: '0',
                message: '删除成功',
            }
        } else {
            ctx.body = {
                code: '1',
                message: '删除失败,查询不到该文章',
            }
        }

    }
    async updatedUserArticle(ctx, next) {
        const { uid, nick_name: author } = ctx.state.user
        const { id, title, content, digest } = ctx.request.body
        console.log(id, title, content, digest);
        if (!id || !title || !content || !digest) {
            ctx.body = {
                code: '1',
                message: '参数不完整',
            }
            return
        }
        const res = await updateArticle({ id, author, uid, title, digest, content })
        if (res) {
            ctx.body = {
                code: '0',
                message: '更新成功',
            }
        } else {
            ctx.body = {
                code: '1',
                message: '更新失败',
            }
        }
    }
}

module.exports = new ArticleController()
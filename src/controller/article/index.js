const { createArticle, getArticleDetail, getArticleList, getAllArticleList, deleteArticleByID, updateArticle, // 发布文章
    addComments,
} = require('../../service/article/index')
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

        if (res) {
            ctx.body = {
                code: '0',
                message: '获取成功',
                res
            }
        } else {
            ctx.body = {
                code: '1',
                message: '获取失败',
            }
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
    async comments(ctx, next) {
        const { id: userId } = ctx.state.user
        // 客户端发送parentId如果为null的话,这边是空字符串
        let { articleId, content, parentId } = ctx.request.body
        !parentId ? parentId = null : ''
        console.log(userId);
        const res = await addComments({ articleId, content, parentId, userId })
        if (res) {
            ctx.body = {
                code: '0',
                message: '发布评论成功',
                res,
            }
            return
        }
        ctx.body = {
            code: '1',
            message: '发布评论失败',
        }
    }
    async deleteComments(ctx, next) {
        // const { id } = ctx.state.user
        // const { commentId } = ctx.request.body
    }
}

module.exports = new ArticleController()
const { createArticle, getArticleDetail, getArticleList, getAllArticleList, deleteArticleByID, updateArticle, // 发布文章
    addComments, deleteCommentsByID, searchArticleBy, lockArticleByID, unlockArticleByID
} = require('../../service/article/index')
class ArticleController {
    async addArticle(ctx, next) {
        const { uid, nick_name: author } = ctx.state.user
        const { title, content, digest, cover_url, file_url, file_name } = ctx.request.body
        const res = await createArticle({ uid, author, title, content, digest, cover_url, file_name, file_url })
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
        const { identity } = ctx.state.user
        let uid = '';
        if (identity === '0') {
            uid = ctx.state.user.uid
        }
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
        const { id, title, content, digest, cover_url, file_url, file_name } = ctx.request.body
        if (!id || !title || !content || !digest) {
            ctx.body = {
                code: '1',
                message: '参数不完整',
            }
            return
        }
        const res = await updateArticle({ id, author, uid, title, digest, content, cover_url, file_url, file_name })
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
        // 评论id
        const { commentId: id } = ctx.query
        if (!id) {
            ctx.body = {
                code: '1',
                message: '参数不完整',
            }
            return
        }
        const res = await deleteCommentsByID({ id })
        if (res) {
            ctx.body = {
                code: '0',
                message: '删除评论成功',
            }
            return
        }
        ctx.body = {
            code: '1',
            message: '删除评论失败',
        }

    }
    async searchArticle(ctx, next) {
        const { keyword, page } = ctx.request.body
        const res = await searchArticleBy({ keyword, page })
        ctx.body = {
            code: '0',
            message: '查询成功',
            res,
        }

    }

    async lockArticle(ctx, next) {
        const { id } = ctx.query
        const { identity } = ctx.state.user
        if (identity !== '0') {
            ctx.body = {
                code: 401,
                message: '权限不足',
                res: null
            }
            return
        }
        const res = await lockArticleByID({ id, state: 1 })
        if (res) {
            ctx.body = {
                code: '0',
                message: '锁定成功',
                res: true
            }
            return
        }
        ctx.body = {
            code: 500,
            message: '操作失败',
            res: true
        }

    }
    async unlockArticle(ctx, next) {
        const { id } = ctx.query
        const { identity } = ctx.state.user

        if (identity !== '0') {
            ctx.body = {
                code: 401,
                message: '权限不足',
                res: null
            }
            return
        }
        const res = await unlockArticleByID({ id, state: 0 })
        if (res) {
            ctx.body = {
                code: '0',
                message: '解除成功',
                res: true
            }
            return
        }
        ctx.body = {
            code: 500,
            message: '操作失败',
            res: true
        }

    }
}

module.exports = new ArticleController()
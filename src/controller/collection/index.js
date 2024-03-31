const { addCollection, getCollections, deleteCollection, hasCollection } = require('../../service/collection/index')
class CollectionController {
    async setCollection(ctx, next) {
        // 设置收藏
        const { uid } = ctx.state.user
        const { aid } = ctx.request.body
        const res = await addCollection({ uid, aid })
        if (res) {
            ctx.body = {
                code: '0',
                message: "收藏成功",
                res
            }
            return
        }
        ctx.body = {
            code: '1',
            message: "没有查到该文章",
            res
        }


    }
    async getCollections(ctx, next) {
        const { uid } = ctx.state.user
        const { page, pageSize } = ctx.query;

        const { res, total } = await getCollections({ uid, page, pageSize })
        ctx.body = {
            code: '0',
            message: "查询成功",
            res, total
        }
    }
    async removeCollection(ctx, next) {
        const { uid } = ctx.state.user
        const { aid } = ctx.query
        const res = await deleteCollection({ uid, aid })
        if (res) {
            ctx.body = {
                code: '0',
                message: "取消收藏成功",
                res: null
            }
            return
        }
        ctx.body = {
            code: '1',
            message: "操作失败",
            res: null
        }
    }
    async getCollection(ctx, next) {
        const { uid } = ctx.state.user
        const { aid } = ctx.query
        const res = await hasCollection({ uid, aid })
        if (res) {
            ctx.body = {
                code: '0',
                message: "查询成功",
                res
            }
            return
        }
        ctx.body = {
            code: '1',
            message: "没有查到该文章",
            res: null
        }
    }
}

module.exports = new CollectionController()
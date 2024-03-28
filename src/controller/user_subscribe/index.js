const { addSubscribe, deleteSubscribe, getSubscribeList, getSubscribe } = require('../../service/user_subscribe');
class SubscribeController {
    // 添加订阅
    async setSubscribe(ctx, next) {
        const { uid } = ctx.state.user;
        const { sub_uid } = ctx.request.body;
        const result = await addSubscribe({ uid, sub_uid });
        console.log(result);
        if (result) {
            ctx.body = {
                code: '0',
                message: '订阅成功',
                res: null
            }
            return
        }
        ctx.body = {
            code: '1',
            message: '订阅失败',
            res: result
        }
    }
    // 取消订阅
    async cancelSubscribe(ctx, next) {
        const { uid } = ctx.state.user;
        const { sub_uid } = ctx.request.body;
        const result = await deleteSubscribe({ uid, sub_uid });
        if (result) {
            ctx.body = {
                code: '0',
                message: '取消成功',
                res: null
            }
            return
        }
        ctx.body = {
            code: '1',
            message: '取消失败',
            res: null
        }
    }
    // 获取订阅列表
    async getUserSubscribe(ctx, next) {
        const { uid } = ctx.state.user;
        const { page, pageSize } = ctx.query
        const { res, total } = await getSubscribeList({ uid, page, pageSize });
        ctx.body = {
            code: '0',
            message: '获取订阅列表成功',
            res,
            total
        }
        return
    }
    // 获取是否订阅
    async getIsSubscribe(ctx, next) {
        const { uid } = ctx.state.user;
        const { sub_uid } = ctx.query;
        const res = await getSubscribe({ uid, sub_uid })
        ctx.body = {
            code: '0',
            message: '获取成功',
            res
        }

    }
}

module.exports = new SubscribeController();
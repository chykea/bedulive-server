const { getAllLiveRoomBy, joinLiveRoom, quitLiveRoom, getLiveRoomBy } = require('../../service/live-student');

class LiveStudentController {

    async getUserLiveRoom(ctx, next) {
        // 获取已订阅直播房间信息
        const { uid } = ctx.state.user;
        const { page } = ctx.query;
        const res = await getAllLiveRoomBy({ uid, page });
        ctx.body = {
            code: '0',
            message: '获取成功',
            ...res,
        };
    }
    async getSubscribeLiveRoom(ctx, next) {
        // 获取订阅直播房间信息
        const { uid } = ctx.state.user;
        const { lid } = ctx.query;
        const res = await getLiveRoomBy({ uid, lid });

        ctx.body = {
            code: '0',
            message: '获取成功',
            res,
        }
    }
    async subscribeLiveRoom(ctx, next) {
        // 订阅直播房间
        const { uid } = ctx.state.user
        const { lid } = ctx.request.body;
        const res = await joinLiveRoom({ uid, lid });
        if (res) {
            ctx.body = {
                code: '0',
                message: '订阅成功',
                res: true
            };
            return
        }
        ctx.body = {
            code: '0',
            message: '订阅失败',
            res: false
        };
    }
    // 取消订阅
    async unsubscribeLiveRoom(ctx, next) {
        const { uid } = ctx.state.user;
        const { id, lid } = ctx.request.body;
        const res = await quitLiveRoom({ id, uid, lid });
        if (res) {
            ctx.body = {
                code: '0',
                message: '取消订阅成功',
                res: null
            }
            return
        }
        ctx.body = {
            code: '0',
            message: '没有查询到该信息',
            res: null
        }
    }
}

module.exports = new LiveStudentController()
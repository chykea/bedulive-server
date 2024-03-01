const { getAllLiveRoom, updateLiveRoom, getLiveRoomBy } = require('../../service/live/index')
class LiveController {
    async getLiveList(ctx, next) {
        const res = await getAllLiveRoom()
        ctx.body = {
            code: '0',
            message: '查询成功',
            res: res
        }
    }
    async getLiveRoom(ctx, next) {
        const { roomId: uid } = ctx.query
        const res = await getLiveRoomBy({ uid })
        ctx.body = {
            code: '0',
            message: '查询成功',
            res: res
        }
    }
    async setLiveInfo(ctx, next) {
        const { uid, title } = ctx.request.body
        const res = await updateLiveRoom({ uid, title })
        if (res[0]) {
            ctx.body = {
                code: '0',
                message: '更新成功',
            }
            return
        }
        ctx.body = {
            code: '10201',
            message: '失败',
        }
    }
}

module.exports = new LiveController()
const { getAllLiveRoom, updateLiveRoom } = require('../../service/live/index')
class LiveController {
    async getLiveList(ctx, next) {
        const res = await getAllLiveRoom()
        ctx.body = {
            code: '0',
            message: '查询成功',
            res: res
        }
    }
    async setLiveInfo(ctx, next) {
        const { uid, title } = ctx.request.body
        const res = await updateLiveRoom({ uid, title })

    }
}

module.exports = new LiveController()
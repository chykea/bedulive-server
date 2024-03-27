const Live = require('../../model/live/index')
const User = require('../../model/user/index')
const LiveStudent = require('../../model/live-student/index')
const { Op } = require('sequelize')
class LiveStudentService {
    async getLiveRoomBy({ uid, lid }) {
        const res = await LiveStudent.findOne({
            where: {
                uid,
                lid
            },
            attributes: ['id', 'uid', 'lid'],
        })

        return res ? true : false
    }
    async getAllLiveRoomBy({ uid, page, pageSize = 10 }) {
        const { rows: res, count: total } = await LiveStudent.findAndCountAll({
            where: {
                uid
            },
            attributes: ['id', 'lid'],
            include: [{
                model: Live,
                as: 'live',
                attributes: ['uid', 'title'],
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['user_name', 'nick_name']
                }]
            }],
            limit: pageSize,
            offset: (page - 1) * pageSize
        })
        return total ? { res, total } : {}
    }
    async joinLiveRoom({ uid, lid }) {
        // 先找,没有再添加
        // 如果created为true表示创建成功
        // 如果created为false表示已经存在
        const [res, created] = await LiveStudent.findOrCreate({
            where: {
                uid, lid
            },
            defaults: {
                uid,
                lid,
            }
        })
        return created
    }
    async quitLiveRoom({ id = '', uid = '', lid = '' }) {
        const res = await LiveStudent.destroy({
            where: {
                [Op.or]: { id, uid, lid },
            }
        })
        return res ? res : null
    }
}
module.exports = new LiveStudentService()
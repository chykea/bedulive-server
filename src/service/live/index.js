const seq = require('../../db/seq')
const Live = require('../../model/live/index')
const User = require('../../model/user/index')
const { QueryTypes } = require('sequelize')
class LiveService {

    async getLiveRoomBy({ uid }) {
        const res = Live.findOne({
            where: {
                uid
            },
            attributes: ['id', 'uid', 'title'],
            include: [{
                model: User,
                as: 'user',
                attributes: ['user_name', 'avatar_url', 'nick_name']
            }]
        })
        return res ? res : null
    }
    async getAllLiveRoom() {
        const res = await Live.findAll({
            attributes: ['id', 'uid', 'title'],
            include: [{
                model: User,
                as: 'user',
                attributes: ['user_name', 'avatar_url', 'nick_name']
            }]
        })
        return res ? res : null
    }

    async createLiveRoom({ uid }) {
        let res = await Live.create({ uid })
        return res.dataValues ? true : false
    }

    async updateLiveRoom({ uid, title }) {
        let res = await Live.update({ title }, { where: { uid } })
        return res
    }
}
module.exports = new LiveService()
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

    async updateLiveRoom({ uid, title, living, state }) {
        const updateOpt = {}
        title && Object.assign(updateOpt, { title })
        living == 0 ? Object.assign(updateOpt, { living: 0 }) : Object.assign(updateOpt, { living: 1 })
        state == 0 ? Object.assign(updateOpt, { state: 0 }) : Object.assign(updateOpt, { state: 1 })
        let res = await Live.update(updateOpt, { where: { uid } })
        return res
    }
}
module.exports = new LiveService()
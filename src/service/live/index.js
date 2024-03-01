const seq = require('../../db/seq')
const Live = require('../../model/live/index')
const { QueryTypes } = require('sequelize')
class LiveService {

    async getLiveRoomBy({ uid }) {

        const [res] = await seq.query(
            `SELECT bedulive_users.user_name, bedulive_users.nick_name, bedulive_lives.title 
        FROM bedulive_lives
        INNER JOIN bedulive_users ON bedulive_lives.uid = bedulive_users.uid
        where bedulive_lives.uid = :uid
        `, { type: QueryTypes.SELECT, replacements: { uid } })

        return res ? res : null
    }
    async getAllLiveRoom() {
        const res = await seq.query(`SELECT bedulive_users.uid, bedulive_users.user_name, bedulive_users.nick_name, bedulive_lives.title 
        FROM bedulive_users 
        INNER JOIN bedulive_lives ON bedulive_users.uid = bedulive_lives.uid`, { type: QueryTypes.SELECT })
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
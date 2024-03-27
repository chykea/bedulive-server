const User = require('../../model/user/index')
const { Op } = require('sequelize')
class UserService {
    async createUser(uid, user_name, password, nick_name = user_name, identity) {
        const res = await User.create({ uid, user_name, password, nick_name, identity })
        return res.dataValues;
    }

    async getUserInfo({ id, uid, user_name, password, identity }) {
        const whereOpt = {}

        id && Object.assign(whereOpt, { id })
        uid && Object.assign(whereOpt, { uid })
        user_name && Object.assign(whereOpt, { user_name })
        password && Object.assign(whereOpt, { password })
        identity && Object.assign(whereOpt, { identity })

        const res = await User.findOne({
            attributes: ['id', 'uid', 'user_name', 'avatar_url', 'nick_name', 'password', 'identity', 'state'],
            where: whereOpt,
        })
        return res ? res.dataValues : null
    }
    async updateById({ id, user_name, password, nick_name, avatar_url, identity, state }) {
        const whereOpt = { id }
        const newUser = {}

        user_name && Object.assign(newUser, { user_name })
        password && Object.assign(newUser, { password })
        nick_name && Object.assign(newUser, { nick_name })
        avatar_url && Object.assign(newUser, { avatar_url })
        identity && Object.assign(newUser, { identity })
        // state非1为0 用上面的写法会导致，当state为0时， 无法修改为0
        if (state === 1 || state === 0) {
            Object.assign(newUser, { state })
        }

        const res = await User.update(newUser, { where: whereOpt })
        return res[0] > 0 ? true : false
    }
    async getAllUser({ page, pageSize = 10 }) {
        const { rows: res, count: total } = await User.findAndCountAll({
            attributes: ['id', 'uid', 'user_name', 'avatar_url', 'nick_name', 'identity', 'state'],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            where: {
                identity: { [Op.ne]: '0' },
            }
        })
        return total > 0 ? { res, total } : null
    }
}

module.exports = new UserService()
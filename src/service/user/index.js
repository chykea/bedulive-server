const User = require('../../model/user/index')
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
            attributes: ['id', 'uid', 'user_name', 'nick_name', 'password', 'identity'],
            where: whereOpt,
        })
        return res ? res.dataValues : null
    }
    async updateById({ id, user_name, password, nick_name }) {
        const whereOpt = { id }
        const newUser = {}

        user_name && Object.assign(newUser, { user_name })
        password && Object.assign(newUser, { password })
        nick_name && Object.assign(newUser, { nick_name })

        const res = await User.update(newUser, { where: whereOpt })
        return res[0] > 0 ? true : false
    }
}

module.exports = new UserService()
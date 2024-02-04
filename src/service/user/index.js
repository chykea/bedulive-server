const User = require('../../model/user/index')
class UserService {
    async createUser(user_name, password, nick_name = user_name, identity) {
        const res = await User.create({ user_name, password, nick_name, identity })
        return res.dataValues;
    }

    async getUserInfo({ id, user_name, password, identity }) {
        const whereOpt = {}

        id && Object.assign(whereOpt, { id })
        user_name && Object.assign(whereOpt, { user_name })
        password && Object.assign(whereOpt, { password })
        identity && Object.assign(whereOpt, { identity })

        const res = await User.findOne({
            attributes: ['id', 'user_name', 'nick_name', 'password', 'identity'],
            where: whereOpt,
        })
        return res ? res.dataValues : null
    }
}

module.exports = new UserService()
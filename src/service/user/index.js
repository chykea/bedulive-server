const User = require('../../model/user/index')
class UserService {
    async createUser(user_name, password, nick_name = user_name) {
        // is_admin 和 is_stu,这里不传参的话就是默认值
        const res = await User.create({ user_name, password, nick_name })
        return res.dataValues;
    }

    async getUserInfo({ id, user_name, password, is_admin }) {
        const whereOpt = {}

        id && Object.assign(whereOpt, { id })
        user_name && Object.assign(whereOpt, { user_name })
        password && Object.assign(whereOpt, { password })
        is_admin && Object.assign(whereOpt, { is_admin })

        const res = await User.findOne({
            attributes: ['id', 'user_name', 'nick_name', 'password', 'is_admin', 'is_stu'],
            where: whereOpt,
        })
        return res ? res.dataValues : null
    }
}

module.exports = new UserService()
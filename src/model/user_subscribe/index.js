
const { DataTypes, Sequelize } = require('sequelize')
const User = require('../user/index')
const seq = require('../../db/seq')

// 用户关注用户
const Subscribe = seq.define('bedulive_subscribe', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户的uid',
    },
    sub_uid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '被关注的用户的uid',
    }
})

Subscribe.belongsTo(User, {
    foreignKey: 'sub_uid',
    targetKey: 'uid',
    as: 'user'
})
// 同步数据库
// Subscribe.sync({ force: true })

module.exports = Subscribe
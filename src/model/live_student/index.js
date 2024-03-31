const { DataTypes, Sequelize } = require('sequelize')
const User = require('../user/index')
const Live = require('../live/index')
const seq = require('../../db/seq')


// 学生订阅直播间表
const LiveStudent = seq.define('bedulive_live_students', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户的uid',
    },
    lid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '直播间id',
    }
})

LiveStudent.belongsTo(User, {
    foreignKey: 'uid',
    targetKey: 'uid',
    onDelete: 'CASCADE',
    as: 'user'
})

LiveStudent.belongsTo(Live, {
    foreignKey: 'lid',
    targetKey: 'id',
    onDelete: 'CASCADE',
    as: 'live'
})
// 强制同步数据库(创建数据表,更新字段执行后会删除原来的表)
// 创建后之后记得注释
// LiveStudent.sync({ force: true })

module.exports = LiveStudent
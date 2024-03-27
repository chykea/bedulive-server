const { DataTypes, Sequelize } = require('sequelize')
const User = require('../../model/user/index')
const seq = require('../../db/seq')

// 创建模型(Model bedulive_live -> 表 bedulive_live)
// 通过用户的uid查找对应的推流地址(这里是通过uid来拼接处推流地址的,不会频繁变动)
const Live = seq.define('bedulive_live', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户的uid',
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '默认标题',
        comment: '标题'
    },
    living: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否正在直播'
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否被封禁'
    }
})

Live.belongsTo(User, {
    foreignKey: 'uid',
    targetKey: 'uid',
    onDelete: 'CASCADE',
    as: 'user'
})
// 强制同步数据库(创建数据表,更新字段执行后会删除原来的表)
// 创建后之后记得注释
// Live.sync({ force: true })

module.exports = Live
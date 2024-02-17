const { DataTypes, Sequelize } = require('sequelize')

const seq = require('../../db/seq')

// 创建模型(Model bedulive_live -> 表 bedulive_live)
// 通过用户的uid查找对应的推流地址(这里是通过uid来拼接处推流地址的,不会频繁变动)
const StreamURL = seq.define('bedulive_live', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户的uuid',
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: '推流地址',
    }

})

// 强制同步数据库(创建数据表,更新字段执行后会删除原来的表)
// 创建后之后记得注释
// StreamURL.sync({ force: true })

module.exports = StreamURL
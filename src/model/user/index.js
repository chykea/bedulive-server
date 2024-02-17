const { DataTypes, Sequelize } = require('sequelize')

const seq = require('../../db/seq')

// 创建模型(Model zd_user -> 表 zd_users)
const User = seq.define('bedulive_user', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户的uuid',
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户名, 唯一',
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码',
    },
    nick_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '昵称'
    },
    identity: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0,
        comment: '用户身份, 0: 管理员(默认); 1: 学生; 2: 教师',
    },
})

// 强制同步数据库(创建数据表,更新字段执行后会删除原来的表)
// 创建后之后记得注释
// User.sync({ force: true })

module.exports = User
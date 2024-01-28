const { DataTypes, Sequelize } = require('sequelize')

const seq = require('../../db/seq')

// 创建模型(Model zd_user -> 表 zd_users)
const User = seq.define('bedulive_user', {
    // id 会被sequelize自动创建, 管理
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
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为管理员, 0: xue(默认); 1: 是管理员',
    },
    is_stu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为学生, 0: 是(默认); 1: 教师',
    },
})

// 强制同步数据库(创建数据表)
// 创建后之后记得注释
// User.sync({ force: true })

module.exports = User
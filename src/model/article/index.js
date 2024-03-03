const { DataTypes, Sequelize } = require('sequelize')
const moment = require('moment')
const seq = require('../../db/seq')

// 文章模型
const Article = seq.define('bedulive_article', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户的uid',
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '作者名字',
    },
    digest: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '文章摘要'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '标题'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "文章内容"
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "文章分类",
        defaultValue: "默认分类"
    },
    // 创建时间
    createdAt: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    // 更新时间
    updatedAt: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
})

// 强制同步数据库(创建数据表,更新字段执行后会删除原来的表)
// 创建后之后记得注释
// Article.sync({ force: true })

module.exports = Article
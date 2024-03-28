
const { DataTypes, Sequelize } = require('sequelize')
const Article = require('../../model/article/index')
const seq = require('../../db/seq')

// 用户收藏文章
const Article_Subscribe = seq.define('bedulive_article_subscribe', {
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
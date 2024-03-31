
const { DataTypes, Sequelize } = require('sequelize')
const User = require('../../model/user/index')
const { Article } = require('../../model/article/index')
const seq = require('../../db/seq')
// 用户收藏文章
const Collection = seq.define('bedulive_collections', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户的uid',
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '文章的aid',
    }
})
Collection.belongsTo(User, {
    foreignKey: 'uid',
    targetKey: 'uid',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})
Collection.belongsTo(Article, {
    foreignKey: 'aid',
    targetKey: 'id',
    as: 'article',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})
// Collection.sync({ force: true })
module.exports = Collection

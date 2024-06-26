const { DataTypes, Sequelize } = require('sequelize')
const moment = require('moment')
const seq = require('../../db/seq');
const User = require('../user');

// 文章模型
const Article = seq.define('bedulive_articles', {
    // id 会被sequelize自动创建, 管理
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户的uid',
    },
    cover_url: {
        type: DataTypes.STRING,
        comment: '文章封面'
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
    commentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "评论数量"
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "文章分类",
        defaultValue: "默认分类"
    },
    file_name: {
        type: DataTypes.STRING,
        comment: '附件名字'
    },
    file_url: {
        type: DataTypes.STRING,
        comment: '附件路径'
    },
    state: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '文章状态 0:正常 1:封禁'
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

// 文章模型
const Comment = seq.define('bedulive_comments', {

    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '评论内容',
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '父级评论id'
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
}, {
    hooks: {
        afterCreate: (comment, options) => {
            // 更新文章的评论计数字段
            return Article.increment('commentCount', { where: { id: comment.articleId } });
        }
    }
})

Article.belongsTo(User, {
    foreignKey: 'uid',
    targetKey: 'uid', // 当管理的字段不是主键时,需要指明一下
    onDelete: 'CASCADE',
    as: 'user'
})
Article.hasMany(Comment, {
    foreignKey: 'articleId',
    onDelete: 'CASCADE',
    as: 'comments'
})
Comment.belongsTo(User, {
    foreignKey: 'userId', // 关联的是user表的id
    onDelete: 'CASCADE',
    as: 'user'
})
Comment.belongsTo(Article, {
    foreignKey: 'articleId',
    onDelete: 'CASCADE',
})
Comment.hasMany(Comment, {
    foreignKey: 'parentId',
    as: 'replies'
});




// 强制同步数据库(创建数据表,更新字段执行后会删除原来的表)
// 创建后之后记得注释
// Article.sync({ force: true })
// Comment.sync({ force: true })
module.exports = { Article, Comment }
const seq = require('../../db/seq')
const User = require('../../model/user/index')
const { Article, Comment } = require('../../model/article/index')
const { Op } = require('sequelize')
class ArticleService {
    // 发布文章
    async createArticle({ uid, title, author, content, digest, category }) {
        const res = await Article.create({
            uid, title, author, content, digest
        })
        return res.dataValues ? true : false
    }
    // 获取所有文章(分页)
    async getAllArticleList({ page, pageSize = 8 }) {
        let { rows: articles, count: total } = await Article.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            attributes: ['id', 'uid', 'title', 'digest', 'author', 'commentCount', 'createdAt']
        })

        return { articles, total }
    }
    // 搜索文章
    async searchArticleBy({ keyword, page, pageSize = 8 }) {
        let { rows: articles, count: total } = await Article.findAndCountAll({
            where: {
                title: {
                    [Op.like]: '%' + keyword + '%'
                }
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            attributes: ['id', 'uid', 'title', 'digest', 'author', 'commentCount', 'createdAt']
        })

        return { articles, total }
    }

    // 获取用户发布文章列表
    async getArticleList({ uid, page, pageSize = 10 }) {
        // 
        let { rows: articles, count: total } = await Article.findAndCountAll({
            where: { uid },
            attributes: ['id', 'uid', 'title', 'author', 'createdAt', 'updatedAt'],
            limit: pageSize,
            offset: (page - 1) * pageSize
        })
        return { articles, total }
    }
    // 获取文章详细
    async getArticleDetail({ id }) {
        const article = await Article.findOne({
            where: { id }, attributes: [
                "id",
                "uid",
                "author",
                "digest",
                "title",
                "content",
                "commentCount",
                "category",
                "createdAt",
            ]
        })
        if (article === null) return null
        // 找出评论
        let comments = await Comment.findAll({
            where: { articleId: id, parentId: null },
            attributes: ['id', 'articleId', 'parentId', 'content', 'createdAt'],
            include: [{
                model: User,
                attributes: ['uid', 'nick_name'],
                as: 'user'
            }]
        })
        let replies = await Comment.findAll({
            where: {
                articleId: id, parentId: {
                    [Op.not]: null
                }
            },
            attributes: ['id', 'articleId', 'parentId', 'content', 'createdAt'],
            include: [{
                model: User,
                attributes: ['uid', 'nick_name'],
                as: 'user'

            }]
        })
        comments = comments.map(comment => {
            return comment.dataValues
        })
        replies = replies.map(reply => {
            return reply.dataValues
        })

        const buildReplyTree = (parentComment, replies) => {

            parentComment.replies = replies.filter(reply => reply.parentId === parentComment.id);
            parentComment.replies.forEach(reply => buildReplyTree(reply, replies));
        };

        // 遍历每个顶级评论，并递归构建回复树
        comments.forEach(comment => buildReplyTree(comment, replies));
        article.dataValues.comments = comments;
        return article.dataValues;

    }
    // 更新文章内容
    async updateArticle({ uid, author, digest, id, title, content }) {
        const [res] = await Article.update({ title, content, author, digest }, { where: { id, uid } })
        return res
    }
    // 删除文章
    async deleteArticleByID({ id, uid }) {
        // 根据文章id、用户uid进行删除
        const res = await Article.destroy({ where: { id, uid } })
        if (res === 1) {
            return true
        } else {
            return false
        }
    }

    /**
     * 
     * @param {articleId} 文章id
     * @param {userId} 用户id
     * @param {content} 回复内容
     * @param {parentId} 父评论id 
     */
    async addComments({ articleId, userId, content, parentId = null }) {
        try {
            // 添加评论,如果报错则是参数错误,表示没有当前文章/用户,直接抛出异常
            const res = await Comment.create({ content, parentId, articleId, userId })
            return res.dataValues ? res.dataValues : null
        } catch (e) {
            // 
            return null
        }


    }
    // 删除评论/回复
    async deleteCommentsByID({ id }) {
        const res = await Comment.destroy({ where: { id } })
        return res === 1 ? true : false
    }
}

module.exports = new ArticleService()
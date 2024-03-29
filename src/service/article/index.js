const seq = require('../../db/seq')
const User = require('../../model/user/index')
const { Article, Comment } = require('../../model/article/index')
const { Op } = require('sequelize')
class ArticleService {
    // 发布文章
    async createArticle({ uid, title, cover_url = '', author, content, digest, category, file_url = '', file_name = '' }) {
        const res = await Article.create({
            uid, title, author, content, digest, cover_url, file_name, file_url
        })
        return res.dataValues ? true : false
    }
    // 获取所有文章(分页)
    async getAllArticleList({ page, pageSize = 8 }) {
        let { rows: articles, count: total } = await Article.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            attributes: ['id', 'uid', 'title', 'digest', 'commentCount', 'createdAt', 'cover_url', 'state'],
            include: [{
                model: User,
                attributes: ['uid', 'user_name', 'avatar_url', 'nick_name'],
                as: 'user'
            }]
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
            attributes: ['id', 'uid', 'title', 'cover_url', 'digest', 'commentCount', 'createdAt'],
            include: [{
                model: User,
                attributes: ['user_name', 'avatar_url', 'nick_name'],
                as: 'user'
            }]
        })

        return { articles, total }
    }

    // 获取用户发布文章列表
    async getArticleList({ uid, page, pageSize = 10 }) {
        // 
        let { rows: articles, count: total } = await Article.findAndCountAll({
            where: { uid },
            attributes: ['id', 'uid', 'title', 'createdAt', 'updatedAt'],
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
                "digest",
                "title",
                "content",
                "cover_url",
                "commentCount",
                "category",
                "file_name",
                "file_url",
                "createdAt",
            ],
            include: [{
                model: User,
                as: 'user',
                attributes: ['uid', 'user_name', 'avatar_url', 'nick_name']
            }]
        })
        if (article === null) return null
        // 找出评论
        let comments = await Comment.findAll({
            where: { articleId: id, parentId: null },
            attributes: ['id', 'articleId', 'parentId', 'content', 'createdAt'],
            include: [{
                model: User,
                attributes: ['uid', 'avatar_url', 'nick_name'],
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
                attributes: ['uid', 'avatar_url', 'nick_name'],
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
    async updateArticle({ uid, author, digest, id, title, content, cover_url = '', file_name = '', file_url = '' }) {
        const [res] = await Article.update({ title, content, cover_url, author, digest, file_name, file_url }, { where: { id, uid } })
        return res
    }
    // 删除文章
    async deleteArticleByID({ id, uid }) {
        // 根据文章id、用户uid进行删除
        const res = await Article.destroy({
            where: {
                [Op.or]: {
                    id,
                    uid
                }
            }
        })
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

    async lockArticleByID({ id, state }) {
        const res = await Article.update({ state }, { where: { id } })
        return res[0] === 1 ? true : false
    }
    async unlockArticleByID({ id, state }) {
        const res = await Article.update({ state }, { where: { id } })
        return res[0] === 1 ? true : false
    }
}

module.exports = new ArticleService()
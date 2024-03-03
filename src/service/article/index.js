const seq = require('../../db/seq')
const Article = require('../../model/article/index')
const { QueryTypes } = require('sequelize')
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
        // , attributes: ['id', 'uid', 'title', 'author', 'createdAt', 'updatedAt']
        let article = Article.findAll({
            limit: pageSize, offset: (page - 1) * pageSize,
            attributes: ['id', 'uid', 'title', 'digest', 'author', 'createdAt', 'updatedAt']
        })
        let count = Article.count()

        let [articles, total] = await Promise.all([article, count])
        articles = articles.map(item => {
            item.dataValues.createdAt = item.dataValues.createdAt.toLocaleString()
            item.dataValues.updatedAt = item.dataValues.updatedAt.toLocaleString()
            return item.dataValues
        })
        return { articles, total }
    }

    // 获取用户发布文章列表
    async getArticleList({ uid = '', page, pageSize = 10 }) {
        let article = Article.findAll({
            where: { uid },
            attributes: ['id', 'uid', 'title', 'author', 'createdAt', 'updatedAt'],
            limit: pageSize,
            offset: (page - 1) * pageSize
        })
        let count = Article.count()
        let [articles, total] = await Promise.all([article, count])
        articles = articles.map(item => {
            item.dataValues.createdAt = item.dataValues.createdAt.toLocaleString()
            item.dataValues.updatedAt = item.dataValues.updatedAt.toLocaleString()
            return item.dataValues
        })
        return { articles, total }
    }
    // 获取文章详细
    async getArticleDetail({ id }) {
        const res = await Article.findOne({ where: { id } })
        res.dataValues.createdAt = res.dataValues.createdAt.toLocaleString()
        res.dataValues.updatedAt = res.dataValues.updatedAt.toLocaleString()

        return res.dataValues
    }
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
}

module.exports = new ArticleService()
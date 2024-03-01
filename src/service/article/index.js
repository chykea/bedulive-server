const seq = require('../../db/seq')
const Article = require('../../model/article/index')
const { QueryTypes } = require('sequelize')
class ArticleService {
    // 发布文章
    async createArticle({ uid, title, author, content, category }) {
        const res = await Article.create({
            uid, title, author, content
        })
        return res.dataValues ? true : false
    }
    // 获取用户发布文章列表
    async getArticleList(uid) {
        let res = await Article.findAll({ where: uid })
        res = res.map(item => item.dataValues)
        return res
    }
    // 获取文章详细
    async getArticleDetail(id) {
        const res = await Article.findOne({
            where: id
        })
        console.log(res);
    }
    // 删除文章
    async deleteArticle(id) {

    }
}

module.exports = new ArticleService()
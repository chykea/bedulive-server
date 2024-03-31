const Collection = require('../../model/article_collection/index')
const { Article } = require('../../model/article/index')
const User = require('../../model/user/index')
class CollectionService {
    async getCollections({ uid, page, pageSize = 10 }) {
        const { rows: res, count: total } = await Collection.findAndCountAll({
            where: { uid },
            attributes: ['id', 'aid'],
            include: [{
                model: Article,
                attributes: ['title', 'digest', 'commentCount'],
                as: 'article',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['nick_name']
                }]
            }]
        })
        return {
            res,
            total
        }
    }

    async addCollection({ uid, aid }) {
        try {
            const res = await Collection.findOrCreate({ where: { uid, aid }, defaults: { uid, aid } })
            return res.length > 0 ? res[0] : null;
        } catch (e) {
            return null;
        }
    }

    async deleteCollection({ uid, aid }) {
        const res = await Collection.destroy({ where: { uid, aid } })
        return res > 0 ? true : false;
    }
    async hasCollection({ uid, aid }) {
        const res = await Collection.findOne({ where: { uid, aid } })
        return res ? true : false;
    }
}

module.exports = new CollectionService()
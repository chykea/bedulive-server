const Subscribe = require('../../model/user_subscribe');
const User = require('../../model/user');
class SubscribeService {
    // 添加订阅
    async addSubscribe({ uid, sub_uid }) {
        const res = await Subscribe.findOrCreate({ where: { uid, sub_uid }, defaults: { uid, sub_uid } });
        return res.length ? true : false;
    }
    // 取消订阅
    async deleteSubscribe({ uid, sub_uid }) {
        const res = await Subscribe.destroy({ where: { uid, sub_uid } });
        return res ? res : null;
    }
    // 获取订阅列表
    async getSubscribeList({ uid, page, pageSize = 10 }) {
        const { rows: res, count: total } = await Subscribe.findAndCountAll({
            where: { uid },
            attributes: ['id', 'sub_uid'],
            include: {
                model: User,
                attributes: ['user_name', 'nick_name', 'avatar_url'],
                as: 'user'
            },
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });
        return { res, total };
    }

    // 获取单条订阅
    async getSubscribe({ uid, sub_uid }) {
        console.log(uid, sub_uid);
        const res = await Subscribe.findOne({
            where: { uid, sub_uid },
            attributes: ['id', 'uid', 'sub_uid'],
        })
        return res ? true : false;
    }
}

module.exports = new SubscribeService()

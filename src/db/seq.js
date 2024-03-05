const { Sequelize } = require('sequelize')

const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_DB,
} = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,         //  最大连接数量
        min: 0,         //  最小连接数量
        idle: 10000     //  连接空置时间（毫秒），超时后将释放连接
    },
    retry: {        //  设置自动查询时的重试标志
        max: 3          //  设置重试次数
    },
    omitNull: false,    //  null 是否通过SQL语句查询
    timezone: '+08:00',
    dialectOptions: {
        charset: "utf8mb4",
        dateStrings: true,
        typeCast: true,
    },
})

seq
    .authenticate()
    .then(() => {
        console.log('数据库连接成功')
    })
    .catch((err) => {
        console.log('数据库连接失败', err)
    })

module.exports = seq
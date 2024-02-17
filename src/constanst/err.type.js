module.exports = {
    userFormateError: {
        code: '10001',
        message: '用户名或密码为空',
        result: null,
    },
    userAlreadyExited: {
        code: '10002',
        message: '用户已经存在',
        result: null,
    },
    userRegisterError: {
        code: '10003',
        message: '用户注册错误',
        result: null,
    },
    userDoesNotExist: {
        code: '10004',
        message: '用户不存在',
        result: null,
    },
    userLoginError: {
        code: '10005',
        message: '用户登录失败',
        result: null,
    },
    invalidPassword: {
        code: '10006',
        message: '密码不匹配',
        result: null,
    },
    tokenExpiredError: {
        code: '10101',
        message: 'token已过期',
        result: null,
    },
    invalidToken: {
        code: '10102',
        message: '无效的token',
        result: null,
    },
    invalidAuth: {
        code: '10103',
        message: '没有权限',
        result: null,
    }
}
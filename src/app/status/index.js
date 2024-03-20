module.exports = (err, ctx) => {
    let status = 404
    console.log(err.message);
    console.log(err.code);
    console.log(err.result);
    switch (err.code) {
        case '10005':
            status = 500
            break
        default:
            status = 404
    }
    ctx.status = status
    ctx.body = {
        code: err.code,
        message: err.message,
        result: err.result
    }
}
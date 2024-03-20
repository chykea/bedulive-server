module.exports = (errObject) => {
    const err = new Error(errObject.message)
    err.code = errObject.code
    err.result = errObject.result
    return err
}
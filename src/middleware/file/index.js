const path = require('path')
const fse = require('fs-extra');
const { updateById } = require('../../service/user');
const UPLOAD_DIR = path.join(__dirname, '../../uploads')
const { SERVER_URL } = require('../../config/config.default.js')


// 文件合并
const mergeChunk = async (filePath, filename, size = 1 * 1024 * 1024) => {
    const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir' + filename);
    const chunks = await fse.readdir(chunkDir);
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]).map(chunkPath => {
        // 合并文件
        fse.appendFileSync(
            path.join(UPLOAD_DIR, filename),
            fse.readFileSync(`${chunkDir}/${chunkPath}`)
        )
    })
    fse.removeSync(chunkDir)
}

// 判断是否需要上传(文件秒传)
const vertifyHash = async (ctx, next) => {
    const { type, hash } = ctx.request.body
    const filePath = path.resolve(UPLOAD_DIR, `${hash}.${type}`)
    if (fse.existsSync(filePath)) {
        ctx.body = {
            code: '0',
            shouldUpload: false,
            url: SERVER_URL + '/' + `${hash}.${type}`
        }
        return
    }
    ctx.body = {
        code: '0',
        shouldUpload: true
    }
}
// 上传切片
const uploadFile = async (ctx, next) => {
    const { hash, filename } = ctx.request.body
    const { chunk } = ctx.request.files
    const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir' + filename);


    // 如果没有存放的目录，新建一个
    if (!fse.existsSync(chunkDir)) {
        await fse.mkdir(chunkDir)
    }
    // 将上传后文件暂存的地方移动到指定目录中
    fse.moveSync(chunk.filepath, `${chunkDir}/${hash}`);
    ctx.body = {
        code: '200',
        msg: '上传切片成功'
    };
}

const mergeFile = async (ctx, next) => {
    const { id } = ctx.state.user
    // 获取文件名
    const { filename, size, purpose } = ctx.request.body
    // 根据文件名获取存放的对应路径
    const filePath = path.resolve(UPLOAD_DIR, `${filename}`)
    // 合并
    await mergeChunk(filePath, filename, size)
    if (purpose === 'avatar') {
        const avatar_url = SERVER_URL + '/' + filename
        await updateById({ id, avatar_url })
        ctx.body = {
            code: '0',
            message: '上传图片成功',
            result: {
                url: avatar_url
            }
        }
        return
    }
    if (purpose === 'cover') {
        const cover_url = SERVER_URL + '/' + filename
        ctx.body = {
            code: '0',
            message: '上传封面成功',
            result: {
                url: cover_url
            }
        }
        return
    }
    if (purpose === 'file') {
        const file_url = SERVER_URL + '/' + filename
        ctx.body = {
            code: '0',
            message: '上传附件成功',
            result: {
                url: file_url,
            }
        }
        return
    }


}
module.exports = { vertifyHash, mergeFile, uploadFile }
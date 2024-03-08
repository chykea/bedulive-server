const path = require('path')
const fse = require('fs-extra');
const { updateById } = require('../../service/user');
const UPLOAD_DIR = path.join(__dirname, '../../uploads')

const { SERVER_URL } = require('../../config/config.default.js')

/**
 * 写入文件流
 * @param {String} path 切片的绝对路径,调用时使用了path.resolve来拼接路径
 * @param {*} writeStream 可写流   
 * @returns 
 */
const pipeStream = (path, writeStream) =>

    new Promise(resolve => {
        // 因为writeStream是同一个写入流，
        const readStream = fse.createReadStream(path);
        readStream.on("end", () => {
            // 读取可读流结束后（即readStream.pipe执行完成后）,删除文件 
            fse.unlinkSync(path);
            resolve()
        })

        // 将readStream流的内容写入到同一个writerStream流中,
        readStream.pipe(writeStream)
    });


/**
 * 合并切片
 * @param {String} filePath 文件路径
 * @param {String} filename 文件名
 * @param {Number} size 切片大小 
 */
const mergeChunk = async (filePath, filename, size = 100 * 1024) => {
    // 存放切片的目录
    const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir' + filename);
    // 读取目录下的文件,并把文件名放到数组中
    const chunkPaths = await fse.readdir(chunkDir);
    // 排序
    chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1])

    // fse.createWriteStream(filePath, { start: index * size })
    // 解释：创建一个可写流，如果filePath相同的话，就是创建同一个可写流，
    // 创建一个可写流，相当于在目标路径中，创建一个空文件，然后再把读取其他文件转成流之后，通过pipe传入到可写流中
    await Promise.all(
        chunkPaths.map(
            (chunkPath, index) => pipeStream(path.resolve(chunkDir, chunkPath), fse.createWriteStream(filePath, { start: index * size }))
        )
    )
    // 合并后删除切片目录
    fse.rmdir(chunkDir)
}

// 判断是否需要上传(文件秒传)
const vertifyHash = async (ctx, next) => {
    const { type, hash } = ctx.request.body
    const filePath = path.resolve(UPLOAD_DIR, `${hash}.${type}`)
    if (fse.existsSync(filePath)) {
        ctx.body = {
            code: '0',
            shouldUpload: false,
            avatar: SERVER_URL + '/' + `${hash}.${type}`
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
    if (!fse.emptyDir(chunkDir)) {
        await fse.mkdir(chunkDir)
    }
    // 将上传后文件暂存的地方移动到指定目录中
    await fse.move(chunk.filepath, `${chunkDir}/${hash}`)
    ctx.body = {
        code: '200',
        msg: '上传切片成功'
    }
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
            msg: '上传图片成功',
            result: {
                avatar: avatar_url
            }
        }
    }


}
module.exports = { vertifyHash, mergeFile, uploadFile }
const socketIO = require('socket.io')
function createSocket(server) {
    // socket跨域问题解决
    const io = socketIO(server, { cors: true })
    let codeHistory = null // 用于保存最新
    let codeSetting = null
    io.on('connection', (socket) => {
        // socket 即当前连接的用户
        socket.on('join', (data) => {
            socket.join(data.roomId)
            socket.broadcast.to(data.roomId).emit('join', `${data.user.user_name}进入房间`)
            if (codeHistory) {
                // 如果教师已经编辑
                socket.emit('getCode', codeHistory)
            }
            if (codeSetting) {
                // 当前用户连接且教师已经编辑
                socket.emit('share', codeSetting)
            }
        })
        socket.on('leave', (data) => {
            // 离开房间倒不用广播,只要把在线人数减去即可
            socket.leave(data.roomId)
        })

        socket.on('sendMsg', (data, cb) => {
            // socket.broadcast.to(data.roomId).emit('getMsg', data)
            if (data.type == 'chat') {
                socket.broadcast.to(data.roomId).emit('getMsg', data)
            }
            else {
                codeHistory = { roomId: data.roomId, user: data.user, code: data.code }
                socket.broadcast.to(data.roomId).emit('getCode', data)
            }
            cb && cb({ code: "200", msg: "消息发送成功" })
        })

        socket.on('openShare', (data) => {
            codeSetting = { roomId: data.roomId, user: data.user, readOnly: !data.isShare }
            // 开启共享即关闭只读
            socket.broadcast.to(data.roomId).emit('share', { user: data.user, readOnly: !data.isShare })
        })
    })


    return io
}
module.exports = createSocket
const socketIO = require('socket.io')
function createSocket(server) {
    // socket跨域问题解决
    const io = socketIO(server, { cors: true })
    let historyMap = new Map() // 用于保存历史
    let history = {
        codeHistory: null, // 用于保存最新
        codeSetting: null,
        canvasHistory: null,
    }

    io.on('connection', (socket) => {
        // socket 即当前连接的用户
        socket.on('join', (data) => {
            socket.join(data.roomId)

            socket.emit('currentUser', io.sockets.adapter.rooms.get(data.roomId).size)
            socket.broadcast.to(data.roomId).emit('currentUser', io.sockets.adapter.rooms.get(data.roomId).size)
            // 如果教师已经编辑
            socket.emit('initCode', historyMap.get(data.roomId)?.codeHistory || null)
            // 当前用户连接且教师已经编辑
            socket.emit('initSetting', historyMap.get(data.roomId)?.codeSetting || null)
            socket.emit('initImage', historyMap.get(data.roomId)?.canvasHistory || null)

        })
        socket.on('leave', (roomId) => {

            (io.sockets.adapter.rooms.get(roomId)) && socket.broadcast.to(roomId).emit('currentUser', io.sockets.adapter.rooms.get(roomId).size - 1)
            socket.leave(roomId)
            if (!(io.sockets.adapter.rooms.get(roomId) && io.sockets.adapter.rooms.get(roomId).size)) {
                // 没有用户,就获取不到房间,直接清空
                historyMap.delete(roomId)
            }
        })

        socket.on('updateRoomInfo', (data) => {
            socket.broadcast.to(data.roomId).emit('updateRoom', data.roomInfo)
        })

        socket.on('sendMsg', (data, cb) => {
            if (data.type == 'chat') {
                socket.broadcast.to(data.roomId).emit('getMsg', data)
            }
            else {
                history.codeHistory = { roomId: data.roomId, user: data.user, code: data.code }
                historyMap.set(data.roomId, history)
                socket.broadcast.to(data.roomId).emit('getCode', data)
            }
            cb && cb({ code: "200", msg: "消息发送成功" })
        })

        socket.on('openShare', (data) => {
            history.codeSetting = { roomId: data.roomId, user: data.user, readOnly: !data.isShare }
            historyMap.set(data.roomId, history)
            // 开启共享即关闭只读
            socket.broadcast.to(data.roomId).emit('share', { user: data.user, readOnly: !data.isShare })
        })

        socket.on('sendPaint', (data) => {
            history.canvasHistory = { roomId: data.roomId, user: data.user, imgSrc: data.data }
            historyMap.set(data.roomId, history)
            socket.broadcast.to(data.roomId).emit('getPaint', data)
        })
    })


    return io
}
module.exports = createSocket
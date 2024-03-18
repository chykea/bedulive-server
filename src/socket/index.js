const socketIO = require('socket.io')
const { NodeVM } = require('vm2')
function createSocket(server) {
    // socket跨域问题解决
    const io = socketIO(server, { cors: true })
    let historyMap = new Map() // 用于保存对应房间的历史消息
    let history = {
        codeHistory: null, // 用于保存直播间最新消息
        codeSetting: null,
        canvasHistory: null,
    }
    let toolUsers = []
    let roomsOwners = new Map()
    io.on('connection', (socket) => {
        // 直播间
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


        // 工具页代码共享
        // 创建房间
        socket.on('createRoom', (data) => {
            if (historyMap.get(data.roomId)) {
                return
            }
            // 房主
            roomsOwners.set(data.roomId, socket.id)
            socket.join(data.roomId)
            toolUsers.push(data.user)
            // 存储代码/图片
            historyMap.set(data.roomId, { userList: toolUsers, code: data.code || '', imgSrc: data.imgSrc || '' })
        })
        socket.on('sendCode', (data) => {
            let origin = historyMap.get(data.roomId)
            historyMap.set(data.roomId, { ...origin, code: data.code })
            socket.broadcast.to(data.roomId).emit('receiveCode', data)
        })
        socket.on('sendImg', (data) => {
            let origin = historyMap.get(data.roomId)
            historyMap.set(data.roomId, { ...origin, imgSrc: data.imgSrc })
            socket.broadcast.to(data.roomId).emit('receiveImg', data)
        })

        socket.on('joinRoom', (data) => {
            if (!(io.sockets.adapter.rooms.get(data.roomId))) {
                socket.emit('roomNotExist')
                return
            }
            socket.join(data.roomId)
            toolUsers.push(data.user)
            // 分开代码和用户列表
            const { code, imgSrc, userList } = historyMap.get(data.roomId)
            // 加入房间,要获取这个房间已发送的数据
            socket.emit('successJoin', { connect: true, userList, roomId: data.roomId })
            socket.emit('receiveCode', { code })
            socket.emit('receiveImg', { imgSrc })

            // 通知其他用户有人加入房间
            socket.broadcast.to(data.roomId).emit('userJoin', { userList })
        })
        socket.on('leaveRoom', (data) => {
            socket.leave(data.roomId)
            // 最后一个用户离开后,清空
            if (!(io.sockets.adapter.rooms.get(data.roomId))) {
                toolUsers = []
                historyMap.delete(data.roomId)
                return
            }
            // 房主离开
            if (roomsOwners.get(data.roomId) === socket.id) {
                roomsOwners.delete(data.roomId)
                socket.broadcast.to(data.roomId).emit('roomOwnerLeave', { roomId: data.roomId, user: data.user })
                toolUsers = []
                historyMap.delete(data.roomId)
                return
            }
            // 用户列表删除该用户
            toolUsers = toolUsers.filter(item => item.uid !== data.user.uid)
            // 用户已离开房间(需要提醒哪个用户离开)
            socket.broadcast.to(data.roomId).emit('userLeave', { userList: toolUsers })
            const code = historyMap.get(data.roomId).code
            historyMap.set(data.roomId, { userList: toolUsers, code: code })
        })
        socket.on('disconnect', () => {
            // 当房主断线离开房间
            roomsOwners.forEach((value, key) => {
                if (value === socket.id) {
                    socket.broadcast.to(key).emit('roomOwnerLeave', { roomId: key, user: null })
                }
            })
        })


        socket.on('runCode', async data => {
            const code = data.code;
            const vm = new NodeVM({
                timeout: 2000, // 限制代码运行时间
                console: 'redirect',
                sandbox: {}
            })
            let res = []
            // 获取console.log的执行结果
            // 只能获取到代码中的console.方法的执行结果
            vm.on('console.log', function (message) {
                res.push(message)
            })

            try {
                await vm.run(code);
                // 代码运行结果
                socket.emit('runRes', res)
            } catch (error) {
                socket.emit('runErr', error.message); // 发生错误时返回错误信息
            }

        })
    })


    return io
}
module.exports = createSocket
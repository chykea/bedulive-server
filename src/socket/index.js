const socketIO = require('socket.io')
const { NodeVM } = require('vm2')
const { Doc, applyUpdate } = require('yjs')

function createSocket(server) {
    // socket跨域问题解决
    const io = socketIO(server, { cors: true })
    const historyMap = new Map() // 用于保存对应房间的历史消息

    const liveConnect = io.of("/live");
    liveConnect.on('connection', (socket) => {
        // 直播间
        // socket 即当前连接的用户
        socket.on('joinLive', ({ roomId, user }) => {
            socket.join(roomId)
            socket.emit('currentUser', liveConnect.adapter.rooms.get(roomId).size)
            socket.broadcast.to(roomId).emit('currentUser', liveConnect.adapter.rooms.get(roomId).size)
            // 如果教师已经编辑
            socket.emit('initCode', historyMap.get(roomId)?.codeHistory || null)
            // 当前用户连接且教师已经编辑
            socket.emit('initSetting', historyMap.get(roomId)?.codeSetting || null)
            socket.emit('initImage', historyMap.get(roomId)?.canvasHistory || null)
        })
        socket.on('leaveLive', ({ roomId, user }) => {
            socket.leave(roomId);
            (liveConnect.adapter.rooms.get(roomId)) && socket.broadcast.to(roomId).emit('currentUser', liveConnect.adapter.rooms.get(roomId).size)
            // 最后一个用户离开后,清空
            if (!(liveConnect.adapter.rooms.get(roomId))) {
                historyMap.delete(roomId)
                return
            }
        })
        socket.on('updateRoomInfo', (data) => {
            socket.broadcast.to(data.roomId).emit('updateRoom', data.roomInfo)
        })
        socket.on('sendMsg', (data) => {
            socket.broadcast.to(data.roomId).emit('getMsg', data)
        })
        socket.on('sendCode', (data) => {
            let origin = historyMap.get(data.roomId) || {
                codeHistory: null,
                codeSetting: null,
                canvasHistory: null,
            }
            const codeHistory = { ...data }
            historyMap.set(data.roomId, { ...origin, codeHistory })
            socket.broadcast.to(data.roomId).emit('getCode', data)
        })
        socket.on('openShare', ({ roomId, readOnly }) => {
            const origin = historyMap.get(roomId) || {
                codeHistory: null,
                codeSetting: null,
                canvasHistory: null,
            }
            const codeSetting = { readOnly }
            historyMap.set(roomId, { ...origin, codeSetting })
            // 开启共享即关闭只读
            socket.broadcast.to(roomId).emit('share', codeSetting)
        })
        socket.on('sendPaint', (data) => {
            let origin = historyMap.get(data.roomId) || {
                codeHistory: null,
                codeSetting: null,
                canvasHistory: null,
            }
            const canvasHistory = { ...data }
            historyMap.set(data.roomId, { ...origin, canvasHistory })
            socket.broadcast.to(data.roomId).emit('getPaint', data)
        })
    })

    const toolUsers = new Map()
    const roomsOwners = new Map()
    const toolConnect = io.of("/tool");
    // const docMap = new Map()
    // 工具页代码共享
    toolConnect.on('connection', (socket) => {
        // 如果用户已经连接到socket服务,则不再执行连接操作
        // 创建房间
        socket.on('createRoom', (data) => {

            if (toolConnect.adapter.rooms.get(data.roomId)) {
                return
            }
            const doc = new Doc();
            // 房主
            roomsOwners.set(data.roomId, socket.id)
            socket.join(data.roomId)
            const users = [data.user]
            // 存储对应房间的用户
            toolUsers.set(data.roomId, users)
            // 存储代码/图片
            historyMap.set(data.roomId, { code: data.code || '', imgSrc: data.imgSrc || '' })
            // 存储对应房间的文档
            // docMap.set(data.roomId, doc)
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
            if (!(toolConnect.adapter.rooms.get(data.roomId))) {
                socket.emit('roomNotExist')
                return
            }
            socket.join(data.roomId)
            // 用户列表
            const curUserList = [...toolUsers.get(data.roomId), data.user];
            toolUsers.set(data.roomId, curUserList);
            // 分开代码和图片
            const { code, imgSrc } = historyMap.get(data.roomId)
            // 加入房间,要获取这个房间已发送的数据
            socket.emit('successJoin', { connect: true, userList: curUserList, roomId: data.roomId })
            socket.emit('receiveCode', { code })
            socket.emit('receiveImg', { imgSrc })

            // 通知其他用户有人加入房间
            socket.broadcast.to(data.roomId).emit('userJoin', { userList: curUserList })
        })
        socket.on('leaveRoom', (data) => {
            socket.leave(data.roomId)
            // 最后一个用户离开后,清空
            if (!(toolConnect.adapter.rooms.get(data.roomId))) {
                // 清空当前房间的用户
                toolUsers.delete(data.roomId)
                // 清空当前房间的历史数据
                historyMap.delete(data.roomId)
                // docMap.delete(data.roomId)
                return
            }
            // 房主离开
            if (roomsOwners.get(data.roomId) === socket.id) {
                roomsOwners.delete(data.roomId)
                socket.broadcast.to(data.roomId).emit('roomOwnerLeave', { roomId: data.roomId, user: data.user })
                toolUsers.delete(data.roomId)
                historyMap.delete(data.roomId)
                // docMap.delete(data.roomId)
                return
            }
            // 用户列表删除该用户
            let curUserList = toolUsers.get(data.roomId)
            curUserList = curUserList.filter(item => item.uid !== data.user.uid)
            toolUsers.set(data.roomId, curUserList)
            // 用户已离开房间(需要提醒哪个用户离开)
            socket.broadcast.to(data.roomId).emit('userLeave', { userList: curUserList })
            const history = historyMap.get(data.roomId)
            historyMap.set(data.roomId, { userList: curUserList, ...history })
        })
        socket.on('disconnect', () => {
            // 当房主断线离开房间
            roomsOwners.forEach((value, key) => {
                if (value === socket.id) {
                    socket.broadcast.to(key).emit('roomOwnerLeave', { roomId: key, user: null })
                }
            })
        })

        /* socket.on('update:yjs', async ({ roomId, update }) => {
            const doc = docMap.get(roomId)
            applyUpdate(doc, update)
            socket.broadcast.to(roomId).emit('update', update)
        })
        socket.on('init:state', ({ roomId, code }) => {
            let origin = historyMap.get(roomId) || {
                code: '',
                imgSrc: ''
            }
            historyMap.set(roomId, { ...origin, code })
        }) */


        socket.on('runCode', async ({ code }) => {
            console.log(toolConnect.adapter.rooms);
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
                console.log(res);
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
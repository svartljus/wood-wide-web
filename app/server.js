const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
var osc = require('osc')

app.use('/', express.static(__dirname))

var udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    remoteAddress: '0.0.0.0',
    localPort: 7000,
    remotePort: 7001,
    broadcast: true
})

udpPort.open()

http.listen(3000, function () {
    console.log(`listening on *:3000`)
})

/* 
    Fixtures: Resets on reboot, not written to file
*/

const numFixtures = 2
const numLayers = 4

const defaultObject = function () {
    return {
        min: 0,
        max: 100,
        val: 50,
        step: 10
        // type: 'f'
    }
}

const fixtures = {}

for (let i = 0; i < numFixtures; i++) {
    const fixtureObject = {
        length: new defaultObject(),
        nudge: new defaultObject()
    }

    for (let j = 0; j < numLayers; j++) {
        const layerObject = {
            red: new defaultObject(),
            green: new defaultObject(),
            blue: new defaultObject(),
            radius: new defaultObject(),
            feather_left: new defaultObject(),
            feather_right: new defaultObject(),
            speed: new defaultObject(),
            repeat: new defaultObject()
        }
        fixtureObject[`layer${j}`] = layerObject
    }
    fixtures[`fixture${i}`] = fixtureObject
}

/* 
    Socket Logic
*/

io.on('connection', function (socket) {
    console.log('socket connected')

    socket.emit('fixtures', fixtures)

    socket.on('update', msg => {
        var message = {
            address: msg.addr, //'/composition/master',
            args: new Array({
                type: 'f',
                value: msg.val / 100 // convert int to fraction
            })
        }
        console.log(message)
        udpPort.send(message, '127.0.0.1', 7001)
    })
})

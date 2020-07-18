const osc = require('osc')

var udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    remoteAddress: '0.0.0.0',
    localPort: 7000,
    remotePort: 7001,
    broadcast: true
})

udpPort.open()

setInterval(function () {
    var message = {
        address: '/composition/master',
        args: new Array({
            type: 'f',
            value: Number(Math.random())
        })
    }
    udpPort.send(message, '127.0.0.1', 7001)
}, 1000)

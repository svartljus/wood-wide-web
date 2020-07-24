import { Fixture } from './lib/fixture.js'
import express from 'express'
import socketIoModule from 'socket.io'
import osc from 'osc'
import { isNullOrUndefined } from 'util'
import httpmodule from 'http'
import { FixtureDiscovery } from './lib/fixtureDiscovery.js'

const app = express()
const http = httpmodule.createServer(app)
const io = socketIoModule(http)

const fixtureDiscovery = new FixtureDiscovery()

fixtureDiscovery.on('fixtures-changed', list => {
    console.log('Fixture list changed', list);
    io.emit('fixtures', list)
})

app.use('/', express.static('./static'))

var udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    remoteAddress: '0.0.0.0',
    localPort: 7000,
    remotePort: 7001,
    broadcast: true
})

udpPort.open()

const port = process.env.PORT || 3000
http.listen(port, function () {
    console.log(`listening on *:${port}`)
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

    socket.emit('fixtures', fixtureDiscovery.getList())

    socket.on('set-fixture-property', msg => {
        console.log('set fixture property', msg)

        if (msg.fixture) {
            const fixture = fixtureDiscovery.getFixture(msg.fixture)
            console.log('Found fixture', fixture)
            if (fixture) {
                if (msg.prop) {
                    fixture.setProp(msg.prop, ~~msg.value, fixtureDiscovery)
                }
                if (msg.nodeprop) {
                    fixture[msg.nodeprop] = msg.value
                }
            }
        }
        else if (msg.broadcast) {
            if (msg.prop) {
                var message = {
                    address: '/' + msg.prop,
                    args: [{
                        type: 'f',
                        value: msg.value
                    }]
                }
                udpPort.send(message, '192.168.2.255', 9000)
            }
        }
    })

    socket.on('call-action', msg => {
        console.log('call action', msg)

        if (msg.action === 'sync') {
            var message = {
                address: '/sync', //'/composition/master',
                args: []
            }
            console.log(message)
            udpPort.send(message, '192.168.2.255', 9000)
        }
    })

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

    socket.on('fetch-config', msg => {
        console.log('fetch config for device', msg);
    });
})



fixtureDiscovery.start()
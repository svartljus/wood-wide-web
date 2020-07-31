import { Fixture } from './lib/fixture.js'
import express from 'express'
import socketIoModule from 'socket.io'
import { isNullOrUndefined } from 'util'
import httpmodule from 'http'
import { FixtureDiscovery } from './lib/fixtureDiscovery.js'
import { OSCSender } from './lib/oscsender.js'
import { Animator } from './lib/animator.js'
import { Animations } from './lib/animations.js'
import path from 'path'
import fs from 'fs'
import junk from 'junk'

const directoryPath = 'presets'

const app = express()
const http = httpmodule.createServer(app)
const io = socketIoModule(http)
const oscSender = new OSCSender()
const animations = new Animations(oscSender)

const fixtureDiscovery = new FixtureDiscovery()

fixtureDiscovery.on('fixtures-changed', list => {
    console.log('Fixture list changed', list)
    io.emit('fixtures', list)
})

app.use('/', express.static('./static'))

const port = process.env.PORT || 3000
http.listen(port, function () {
    console.log(`listening on *:${port}`)
})

io.on('connection', function (socket) {
    console.log('socket connected')

    socket.emit('fixtures', fixtureDiscovery.getList())

    socket.on('load-preset', () => {
        fs.readdir(directoryPath, function (err, files) {
            files = files.filter(junk.not)
            if (err) {
                return console.log('Unable to scan directory: ' + err)
            }
            files.forEach(function (file) {
                let rawdata = fs.readFileSync(path.join(directoryPath, file))
                let preset = JSON.parse(rawdata)
                socket.emit('preset-loaded', preset)
            })
        })
    })

    socket.on('save-preset', preset => {
        let data = JSON.parse(preset)
        var filename = data.name.replace(/[^\x00-\x7F]/g, '') + '.json'
        fs.writeFile(path.join(directoryPath, filename), preset, err => {
            if (err) throw err
            console.log('Data written to file')
        })
    })

    socket.on('set-fixture-property', msg => {
        console.log('set fixture property', msg)

        if (msg.fixture) {
            const fixture = fixtureDiscovery.getFixture(msg.fixture)
            console.log('Found fixture', fixture)
            if (fixture) {
                if (msg.prop) {
                    fixture.setProp(msg.prop, ~~msg.value, oscSender)
                }
                if (msg.nodeprop) {
                    fixture[msg.nodeprop] = msg.value
                }
            }
        } else if (msg.broadcast) {
            if (msg.prop) {
                var message = {
                    address: '/' + msg.prop,
                    args: [
                        {
                            type: 'f',
                            value: msg.value
                        }
                    ]
                }

                fixtureDiscovery.getAllAddresses().forEach(a => {
                    oscSender.send(message, a, 9000)
                })
            }
        }
    })

    socket.on('call-action', msg => {
        console.log('call action', msg)

        if (msg.action === 'sync') {
            const message = { address: '/sync', args: [] }

            fixtureDiscovery.getAllAddresses().forEach(a => {
                oscSender.send(message, a, 9000)
            })
        }

        if (msg.action === 'fetch-config') {
            const fix = fixtureDiscovery.getFixture(msg.fixture)
            console.log('fetch config for device', msg, fix)

            if (fix) {
                fix.fetchProps().then(() => {
                    socket.emit('fixtures', fixtureDiscovery.getList())
                })
            }
        }
    })

    socket.on('animate', msg => {
        console.log('trigger animation', msg)
        const fix = fixtureDiscovery.getFixture(msg.fixture)
        if (fix) {
            if (msg.animation == 1) {
                const v0 = fix.getProp('prop1', 0)
                animations.queue(new Animator(fix.id, fix, 'prop1', v0 + 100, v0, 'down', 1000.0))
            }
            if (msg.animation == 2) {
                const v1 = fix.getProp('prop2', 0)
                animations.queue(new Animator(fix.id, fix, 'prop2', v1 + 100, v1, 'sine', 3000.0))
            }
            if (msg.animation == 3) {
                const v2 = fix.getProp('prop3', 0)
                animations.queue(new Animator(fix.id, fix, 'prop2', v2 + 100, v2, 'fastlfo', 3000.0))
            }
        }
    })
})

// Create some mock fixtures if you dont have any actual lights

fixtureDiscovery.addMockFixture(new Fixture('fix.10', '192.168.2.10'))
fixtureDiscovery.addMockFixture(new Fixture('fix.11', '192.168.2.11'))
fixtureDiscovery.addMockFixture(new Fixture('fix.12', '192.168.2.12'))
fixtureDiscovery.addMockFixture(new Fixture('fix.13', '192.168.2.13'))
fixtureDiscovery.addMockFixture(new Fixture('fix.14', '192.168.2.14'))
fixtureDiscovery.addMockFixture(new Fixture('fix.15', '192.168.2.15'))
fixtureDiscovery.addMockFixture(new Fixture('fix.16', '192.168.2.16'))
fixtureDiscovery.addMockFixture(new Fixture('fix.17', '192.168.2.17'))
fixtureDiscovery.addMockFixture(new Fixture('fix.18', '192.168.2.18'))
fixtureDiscovery.addMockFixture(new Fixture('fix.19', '192.168.2.19'))

oscSender.fixtureDiscovery = fixtureDiscovery

oscSender.start()
animations.start()
fixtureDiscovery.start()

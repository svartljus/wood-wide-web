import osc from 'osc'

export class OSCSender {
    constructor() {
        this.oscPort = null
        this.queue = []
        this.brokenUntil = {}
        this.fixtureDiscovery = null
    }

    start() {
        this.oscPort = new osc.UDPPort({
            localAddress: "0.0.0.0", // shouldn't matter here
            localPort: 5000, // not receiving, but here's a port anyway
            remoteAddress: "192.168.2.255", // the other laptop
            remotePort: 9000,
        })

        this.oscPort.open()

        this.oscPort.on('error', e => {
            // console.log('OSC error.', e.errno, e.code, e)
            const key = `${e.address}:${e.port}`;
            console.log(`OSC error, mark ${key} as broken.`)
            this.brokenUntil[key] = Date.now() + 5000
            if (this.fixtureDiscovery) {
                const fix = this.fixtureDiscovery.getByAddress(e.address)
                if (fix) {
                    if (!fix.broken) {
                        console.log('OSC Mark fixture as broken: ' + fix.id)
                        fix.broken = true
                        fix.dirty = true
                    }
                }
            }
        })

        this.oscPort.on('ready', () => {
            console.log('OSC port open.')
        })

        this.popQueueAndWait()
    }

    send(message, host, port) {
        // TODO: maybe queue several time to make sure all devices get it, udp you know, and unreliable esps...
        this.queue.push({
            message,
            host,
            port: port || 9000
        })

        setTimeout(() => {
            this.queue.push({
                message,
                host,
                port: port || 9000
            })
        }, 5+Math.random()*10);

        setTimeout(() => {
            this.queue.push({
                message,
                host,
                port: port || 9000
            })
        }, 15+Math.random()*10);

        setTimeout(() => {
            this.queue.push({
                message,
                host,
                port: port || 9000
            })
        }, 30+Math.random()*10);
    }

    popQueueAndWait() {
        const item = (this.queue.length > 0) ? this.queue.shift() : null

        if (item) {
            // check if device is broken
            const key = `${item.host}:${item.port}`;
            const broken = this.brokenUntil[key]
            if (broken && Date.now() < broken) {
                // Don't send.
                // const key = `${item.host}:${item.port}`;
                // const broken = this.brokenUntil[key]
            } else {
                if (this.fixtureDiscovery) {
                    const fix = this.fixtureDiscovery.getByAddress(item.host)
                    if (fix) {
                        if (broken) {
                            console.log('OSC Mark fixture as not broken: ' + fix.id)
                            fix.broken = false
                            fix.dirty = true
                        }
                    }
                }

                try {
                    console.log(`Sending OSC to ${item.host}:${item.port} => ${JSON.stringify(item.message)}`)
                    this.oscPort.send(item.message, item.host, item.port)
                } catch(e) {
                    console.log('Failed to send message', e)
                }
            }
        }

        setTimeout(this.popQueueAndWait.bind(this), item ? 10 : 50); // Send next message in a bit, if queue is empty, relax a bit more
    }
}

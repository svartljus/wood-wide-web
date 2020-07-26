import osc from 'osc'

export class OSCSender {
    constructor() {
        this.oscPort = null
        this.queue = []
    }

    start() {

        this.oscPort = new osc.UDPPort({
            localAddress: "0.0.0.0", // shouldn't matter here
            localPort: 5000, // not receiving, but here's a port anyway
            remoteAddress: "192.168.2.255", // the other laptop
            remotePort: 9000,
        })
        this.oscPort.open()
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
    }

    popQueueAndWait() {
        const item = (this.queue.length > 0) ? this.queue.shift() : null

        if (item) {
            try {
                console.log('Sending OSC', item)
                this.oscPort.send(item.message, item.host, item.port)
            } catch(e) {
                console.log('Failed to send message', e)
            }
        }

        setTimeout(this.popQueueAndWait.bind(this), item ? 15 : 50); // Send next message in a bit, if queue is empty, relax a bit more
    }
}

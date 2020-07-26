import EventEmitter from 'events'
import Bonjour from 'bonjour'
import { Fixture } from './fixture.js'

export class FixtureDiscovery extends EventEmitter {

    constructor() {
        super()

        this.cache = {}
        this.visibleDevices = {}
    }

    getList() {
        return this.lightBrowser.services
            .map(s => this.visibleDevices[s.name] && this.cache[s.name])
            .filter(t => t)
            .sort((a, b) => a.id.localeCompare(b.id))
    }

    getFixture(id) {
        const svc = this.lightBrowser.services
            .find(s => s.name === id)

        console.log('svc', this.lightBrowser.services, svc)

        if (svc) {
            return this.cache[svc.name]
        }

        return undefined;
    }

    start() {
        console.log('Start scanning for mDNS/ZeroConf/Bonjour devices')

        this.bonjour = new Bonjour()

        this.lightBrowser = this.bonjour.find({
            type: 'osc',
            protocol: 'udp'
        });

        this.lightBrowser.on('up', service => {
            console.log('Light appeared:', service)

            if (typeof(this.cache[service.name]) === 'undefined') {
                this.cache[service.name] = new Fixture()
            }

            var f = this.cache[service.name]
            f.id = service.name
            f.fqdn = service.fqdn
            if (!f.displayname) {
                f.displayname = service.name
            }
            f.address = service.addresses[0]
            f.oscPort = null
            this.cache[service.name] = f
            this.visibleDevices[service.name] = true
            this.emit('fixtures-changed', this.getList())

            f.fetchProps().then(() => {
                this.emit('fixtures-changed', this.getList())
            })
        });

        this.lightBrowser.on('down', service => {
            console.log('Light disappeared:', service)
            console.log('Full list:', lightBrowser.services)

            this.visibleDevices[service.name] = false

            this.emit('fixtures-changed', this.getList())
        });
    }

}

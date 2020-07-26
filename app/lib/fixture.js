import fetch from 'node-fetch'

export class Fixture {
    constructor() {
        this.id = ''
        this.fqdn = ''
        this.address = ''
        this.displayname = ''
        this.props = []
        this.dirty = false
    }

    fetchProps() {
        const url = `http://${this.address}/config`
        console.log('Fetching config for fixture ' + this.id + ': ' + url)
        return fetch(url).then(r => r.json()).then(props => {
            console.log('got props', props);
            this.props = props;
            return true;
        });
    }

    setDisplayName(name) {
        this.displayname = name
        this.dirty = true
    }

    setProp(prop, value, oscSender) {
        console.log('Setting prop ' + prop + ' to value ' + value + ' on fixture ' + this.id + ' (' + this.address + ')')
        if (value != this.props[prop]) {
            this.props[prop] = value
            this.dirty = true

            const message = {
                address: `/${prop}`,
                args: [{
                    type: 'f',
                    value,
                }]
            }

            console.log('Sending OSC message', message)
            oscSender.send(message, this.address)
        }
    }
}

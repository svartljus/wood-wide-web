export class Animations {
    constructor(oscSender) {
        this.animators = []
        this.oscSender = oscSender
    }

    start() {
        this.tick()
    }

    tick() {
        this.animators.forEach(a => a.tick(30, this.oscSender))
        this.animators = this.animators.filter(a => !a.expired)

        setTimeout(this.tick.bind(this), 30);
    }

    queue(animator) {
        // TODO: Do not animates same property at the same time
        this.animators.push(animator)
    }
}

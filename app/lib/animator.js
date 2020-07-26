export class Animator {

    constructor(fixture, fixtureObj, prop, tempValue, defaultValue, shape, durationMillis) {
        this.expired = false
        this.fixture = fixture
        this.fixtureObj = fixtureObj
        this.prop = prop
        this.tempValue = tempValue
        this.defaultValue = defaultValue
        this.shape = shape
        this.durationMillis = durationMillis
        this.timeMillis = 0
    }

    interpolator(progress, type) {
        // Default, falling ramp
        return 1.0 - progress
    }

    tick(dT, oscSender) {
        const progress = Math.max(0, Math.min(1, this.timeMillis / this.durationMillis))
        const ramp = this.interpolator(progress, this.shape)
        const value = Math.round(this.defaultValue + ramp * (this.tempValue - this.defaultValue))
        console.log(`Animator tick, fixture=${this.fixture}, prop=${this.prop}, time=${this.timeMillis}s/${this.durationMillis}s, progress=${Math.round(progress*1000)/1000}, rampvalue=${Math.round(ramp*1000)/1000}, value=${Math.round(value*1000)/1000}`)

        if (this.fixtureObj) {
            this.fixtureObj.setProp(this.prop, value, oscSender)
        }

        if (this.timeMillis > this.durationMillis) {
            console.log('Animator expired')
            this.expired = true
        }

        this.timeMillis += dT
    }

}
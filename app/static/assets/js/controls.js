const speedMultiplierFormatter = value => `${value / 1000}x`

const rpmFormatter = value => `${value / 1000} rpm`

const multiplierFormatter = value => `${value} x`

const percentFormatter = value => `${value}%`

const percent1000Formatter = value => `${value / 1000}%`

const CONTROLS = [
    {
        id: 'base-speed',
        prop: 'basespeed',
        range: [1, 10000],
        formatter: rpmFormatter
    },

    {
        id: 'opacity',
        prop: 'opacity',
        formatter: percentFormatter
    },

    {
        id: 'layer1-red',
        prop: 'layer1/red'
    },

    {
        id: 'layer2-red',
        prop: 'layer2/red'
    },

    {
        id: 'layer3-red',
        prop: 'layer3/red'
    },

    {
        id: 'layer4-red',
        prop: 'layer4/red'
    },

    {
        id: 'layer1-green',
        prop: 'layer1/green'
    },

    {
        id: 'layer2-green',
        prop: 'layer2/green'
    },

    {
        id: 'layer3-green',
        prop: 'layer3/green'
    },

    {
        id: 'layer4-green',
        prop: 'layer4/green'
    },
    {
        id: 'layer1-blue',
        prop: 'layer1/blue'
    },

    {
        id: 'layer2-blue',
        prop: 'layer2/blue'
    },

    {
        id: 'layer3-blue',
        prop: 'layer3/blue'
    },

    {
        id: 'layer4-blue',
        prop: 'layer4/blue'
    },

    {
        id: 'layer1-speed',
        prop: 'layer1/speed',
        range: [1, 10000],
        formatter: speedMultiplierFormatter
    },
    {
        id: 'layer2-speed',
        prop: 'layer2/speed',
        range: [1, 10000],
        formatter: speedMultiplierFormatter
    },
    {
        id: 'layer3-speed',
        prop: 'layer3/speed',
        range: [1, 10000],
        formatter: speedMultiplierFormatter
    },
    {
        id: 'layer4-speed',
        prop: 'layer4/speed',
        range: [1, 10000],
        formatter: speedMultiplierFormatter
    },

    {
        id: 'layer1-opacity',
        prop: 'layer1/opacity',
        value: 1,
        formatter: percentFormatter
    },
    {
        id: 'layer2-opacity',
        prop: 'layer2/opacity',
        default: 1,
        formatter: percentFormatter
    },
    {
        id: 'layer3-opacity',
        prop: 'layer3/opacity',
        default: 1,
        formatter: percentFormatter
    },
    {
        id: 'layer4-opacity',
        prop: 'layer4/opacity',
        default: 1,
        formatter: percentFormatter
    },

    {
        id: 'layer1-blending',
        prop: 'layer1/blending',
        default: 0,
        range: [0, 1]
    },
    {
        id: 'layer2-blending',
        prop: 'layer2/blending',
        default: 0,
        range: [0, 1]
    },
    {
        id: 'layer3-blending',
        prop: 'layer3/blending',
        default: 0,
        range: [0, 1]
    },
    {
        id: 'layer4-blending',
        prop: 'layer4/blending',
        default: 0,
        range: [0, 1]
    },

    {
        id: 'layer1-offset',
        prop: 'layer1/offset',
        formatter: percentFormatter
    },
    {
        id: 'layer2-offset',
        prop: 'layer2/offset',
        formatter: percentFormatter
    },
    {
        id: 'layer3-offset',
        prop: 'layer3/offset',
        formatter: percentFormatter
    },
    {
        id: 'layer4-offset',
        prop: 'layer4/offset',
        formatter: percentFormatter
    },

    {
        id: 'layer1-repeat',
        prop: 'layer1/repeat',
        range: [1, 10],
        formatter: multiplierFormatter
    },
    {
        id: 'layer2-repeat',
        prop: 'layer2/repeat',
        range: [1, 10],
        formatter: multiplierFormatter
    },
    {
        id: 'layer3-repeat',
        prop: 'layer3/repeat',
        range: [1, 10],
        formatter: multiplierFormatter
    },
    {
        id: 'layer4-repeat',
        prop: 'layer4/repeat',
        range: [1, 10],
        formatter: multiplierFormatter
    },

    {
        id: 'layer1-size',
        prop: 'layer1/size',
        formatter: percentFormatter
    },
    {
        id: 'layer2-size',
        prop: 'layer2/size',
        formatter: percentFormatter
    },
    {
        id: 'layer3-size',
        prop: 'layer3/size',
        formatter: percentFormatter
    },
    {
        id: 'layer4-size',
        prop: 'layer4/size',
        formatter: percentFormatter
    },

    {
        id: 'layer1-feather1',
        prop: 'layer1/feather1',
        formatter: percentFormatter
    },
    {
        id: 'layer2-feather1',
        prop: 'layer2/feather1',
        formatter: percentFormatter
    },
    {
        id: 'layer3-feather1',
        prop: 'layer3/feather1',
        formatter: percentFormatter
    },
    {
        id: 'layer4-feather1',
        prop: 'layer4/feather1',
        formatter: percentFormatter
    },
    {
        id: 'layer1-feather2',
        prop: 'layer1/feather2',
        formatter: percentFormatter
    },
    {
        id: 'layer2-feather2',
        prop: 'layer2/feather2',
        formatter: percentFormatter
    },
    {
        id: 'layer3-feather2',
        prop: 'layer3/feather2',
        formatter: percentFormatter
    },
    {
        id: 'layer4-feather2',
        prop: 'layer4/feather2',
        formatter: percentFormatter
    }
]

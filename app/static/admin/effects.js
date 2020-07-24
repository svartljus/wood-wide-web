var socket = io()

let all_fixtures = null
let selected_fixtures = [];
let preset_obj = {}

const speedMultiplierFormatter = value => (`${value / 1000}x`)

const rpmFormatter = value => (`${value / 1000} rpm`)

const multiplierFormatter = value => (`${value} x`)

const percentFormatter = value => (`${value}%`)

const percent1000Formatter = value => (`${value / 1000}%`)

const CONTROLS = [
    {
        id: 'layer1-color',
        type: 'color',
        props: ['layer1/red', 'layer1/green', 'layer1/blue'],
    },
    {
        id: 'layer2-color',
        type: 'color',
        props: ['layer2/red', 'layer2/green', 'layer2/blue'],
    },
    {
        id: 'layer3-color',
        type: 'color',
        props: ['layer3/red', 'layer3/green', 'layer3/blue'],
    },
    {
        id: 'layer4-color',
        type: 'color',
        props: ['layer4/red', 'layer4/green', 'layer4/blue'],
    },

    {
        id: 'base-speed',
        type: 'int',
        prop: 'basespeed',
        formatter: rpmFormatter,
    },

    {
        id: 'opacity',
        type: 'int',
        prop: 'opacity',
        formatter: percentFormatter,
    },

    {
        id: 'layer1-speed',
        type: 'int',
        prop: 'layer1/speed',
        formatter: speedMultiplierFormatter,
    },
    {
        id: 'layer2-speed',
        type: 'int',
        prop: 'layer2/speed',
        formatter: speedMultiplierFormatter,
    },
    {
        id: 'layer3-speed',
        type: 'int',
        prop: 'layer3/speed',
        formatter: speedMultiplierFormatter,
    },
    {
        id: 'layer4-speed',
        type: 'int',
        prop: 'layer4/speed',
        formatter: speedMultiplierFormatter,
    },

    {
        id: 'layer1-opacity',
        type: 'int',
        prop: 'layer1/opacity',
        formatter: percentFormatter,
    },
    {
        id: 'layer2-opacity',
        type: 'int',
        prop: 'layer2/opacity',
        formatter: percentFormatter,
    },
    {
        id: 'layer3-opacity',
        type: 'int',
        prop: 'layer3/opacity',
        formatter: percentFormatter,
    },
    {
        id: 'layer4-opacity',
        type: 'int',
        prop: 'layer4/opacity',
        formatter: percentFormatter,
    },

    {
        id: 'layer1-offset',
        type: 'int',
        prop: 'layer1/offset',
        formatter: percentFormatter,
    },
    {
        id: 'layer2-offset',
        type: 'int',
        prop: 'layer2/offset',
        formatter: percentFormatter,
    },
    {
        id: 'layer3-offset',
        type: 'int',
        prop: 'layer3/offset',
        formatter: percentFormatter,
    },
    {
        id: 'layer4-offset',
        type: 'int',
        prop: 'layer4/offset',
        formatter: percentFormatter,
    },

    {
        id: 'layer1-repeat',
        type: 'int',
        prop: 'layer1/repeat',
        formatter: multiplierFormatter,
    },
    {
        id: 'layer2-repeat',
        type: 'int',
        prop: 'layer2/repeat',
        formatter: multiplierFormatter,
    },
    {
        id: 'layer3-repeat',
        type: 'int',
        prop: 'layer3/repeat',
        formatter: multiplierFormatter,
    },
    {
        id: 'layer4-repeat',
        type: 'int',
        prop: 'layer4/repeat',
        formatter: multiplierFormatter,
    },

    {
        id: 'layer1-size',
        type: 'int',
        prop: 'layer1/size',
        formatter: percentFormatter,
    },
    {
        id: 'layer2-size',
        type: 'int',
        prop: 'layer2/size',
        formatter: percentFormatter,
    },
    {
        id: 'layer3-size',
        type: 'int',
        prop: 'layer3/size',
        formatter: percentFormatter,
    },
    {
        id: 'layer4-size',
        type: 'int',
        prop: 'layer4/size',
        formatter: percentFormatter,
    },

    {
        id: 'layer1-feather1',
        type: 'int',
        prop: 'layer1/feather1',
        formatter: percentFormatter,
    },
    {
        id: 'layer2-feather1',
        type: 'int',
        prop: 'layer2/feather1',
        formatter: percentFormatter,
    },
    {
        id: 'layer3-feather1',
        type: 'int',
        prop: 'layer3/feather1',
        formatter: percentFormatter,
    },
    {
        id: 'layer4-feather1',
        type: 'int',
        prop: 'layer4/feather1',
        formatter: percentFormatter,
    },
    {
        id: 'layer1-feather2',
        type: 'int',
        prop: 'layer1/feather2',
        formatter: percentFormatter,
    },
    {
        id: 'layer2-feather2',
        type: 'int',
        prop: 'layer2/feather2',
        formatter: percentFormatter,
    },
    {
        id: 'layer3-feather2',
        type: 'int',
        prop: 'layer3/feather2',
        formatter: percentFormatter,
    },
    {
        id: 'layer4-feather2',
        type: 'int',
        prop: 'layer4/feather2',
        formatter: percentFormatter,
    },
]

function generatePreset() {
    let ret = {}
    ret._random = Math.floor(Math.random() * 100000)

    CONTROLS.forEach(c => {
        if (c.type == 'int') {
            var el = document.getElementById(c.id)
            ret[c.prop] = ~~el.value
        }

        if (c.type == 'color') {
            var el = document.getElementById(c.id)
            var rr = parseInt(el.value.substring(1, 3), 16);
            var gg = parseInt(el.value.substring(3, 5), 16);
            var bb = parseInt(el.value.substring(5, 7), 16);
            // console.log('color', el.value, rr, gg, bb);
            ret[c.props[0]] = ~~rr
            ret[c.props[1]] = ~~gg
            ret[c.props[2]] = ~~bb
        }
    });

    return ret
}

function updatePresetCode() {
    preset_obj = generatePreset()
    const code = JSON.stringify(preset_obj)
    document.getElementById('presetcode').value = code;
}

function updateLabel(id) {
    var ctrl = CONTROLS.find(c => c.id === id)
    var el = document.getElementById(id)
    var el2 = document.querySelector('[data-label-for*="' + id + '"]')
    var text = ctrl.formatter !== undefined ? ctrl.formatter(el.value) : `${el.value}`
    el2.textContent = text;
}

function updateLabels() {
    CONTROLS.forEach(c => {
        if (c.type == 'int') {
            updateLabel(c.id)
        }
    });
}

function updateInputsFromPreset() {
    console.log('updateInputsFromPreset')

    CONTROLS.forEach(c => {
        if (c.type == 'int') {
            var el = document.getElementById(c.id)
            // console.log('el2', el)
            el.value = preset_obj[c.prop]
        }

        if (c.type == 'color') {
            var el = document.getElementById(c.id)
            const tohex = x => {
                x = x.toString(16)
                if (x.length == 1) x = '0' + x
                return x
            }
            var rr = tohex(preset_obj[c.props[0]])
            var gg = tohex(preset_obj[c.props[1]])
            var bb = tohex(preset_obj[c.props[2]])
            el.value = `#${rr}${gg}${bb}`
        }
    });
}

function loadFromPresetObject(obj, sendupdates) {
    if (obj) {
        console.log('got object', obj)

        Object.keys(obj).forEach(k => {
            var ctrl = CONTROLS.find(c =>
                (c.prop && c.prop === k) || (c.props && c.props.indexOf(k) !== -1))

            preset_obj[k] = obj[k]

            console.log('k', k, ctrl)
            if (ctrl) {
                if (sendupdates) {
                    sendOSCUpdates(ctrl, obj)
                }
            }
        })
    }

    updateInputsFromPreset()
    updateLabels()
}

function loadFromPreset(presetCode, sendupdates) {
    let obj = null
    try {
        obj = JSON.parse(presetCode)
    } catch(e) {
    }

    loadFromPresetObject(obj, sendupdates)
}

function updateSelectedFixtures(e) {
    console.log('updateSelectedFixtures', e)

    var idx = selected_fixtures.indexOf(e.target.id)
    if (e.target.checked) {
        if (idx === -1) {
            selected_fixtures.push(e.target.id)
        }
    } else {
        if (idx !== -1) {
            selected_fixtures.splice(idx, 1);
        }
    }
    console.log('new list of selected devices', selected_fixtures)
}

function updateFixtureLists() {

    var el;

    el = document.getElementById('load-from-device')
    if (el) {
        // console.log('el', el)
        el.options = []
        all_fixtures.forEach((f, i) => {
            // console.log('f', f)
            var o = new Option()
            o.value = f.id
            o.text = f.id + ' (' + f.displayname + ')'
            el.options[i] = o
        })
    }

    el = document.getElementById('apply-to-device')
    if (el) {
        // console.log('el', el)
        el.innerHTML = ''
        all_fixtures.forEach(f => {
            // console.log('f', f)
            var li = document.createElement('li')
            var lab = document.createElement('label')
            var inp = document.createElement('input')
            var sp = document.createElement('span')
            sp.textContent = ' ' + f.id + ' (' + f.displayname + ')'
            inp.type = 'checkbox'
            inp.id = f.id
            inp.addEventListener('change', updateSelectedFixtures)
            lab.appendChild(inp)
            lab.appendChild(sp)
            li.appendChild(lab)
            el.appendChild(li)
        })
    }
}

function sendOSCUpdate(ctrl, fixture, broadcast, obj) {
    if (ctrl.type === 'color') {
        ctrl.props.forEach(prop => {
            const msg = {
                fixture,
                broadcast,
                prop: prop,
                value: obj[prop],
            }
            console.log('send osc', msg)
            socket.emit('set-fixture-property', msg)
        })
    } else {
        const msg = {
            fixture,
            broadcast,
            prop: ctrl.prop,
            value: obj[ctrl.prop],
        }
        console.log('send osc', msg)
        socket.emit('set-fixture-property', msg)
    }
}

function sendOSCUpdates(ctrl, obj) {
    var broadcast = document.getElementById('all-devices').checked
    if (broadcast) {
        sendOSCUpdate(ctrl, undefined, true, obj)
    } else {
        selected_fixtures.forEach(sf => {
            sendOSCUpdate(ctrl, sf, false, obj)
        })
    }
}

function elementChanged(el) {
    updateLabels();
    updatePresetCode();

    var ctrl = CONTROLS.find(c => c.id === el.id)
    if (ctrl) {
        sendOSCUpdates(ctrl, preset_obj)
    }
}

socket.on('fixtures', fixtures => {
    console.log('Got fixtures', fixtures)
    all_fixtures = fixtures
    updateFixtureLists()
})

function loadPresetFromCode() {
    const code = document.getElementById('presetcode').value.trim()
    loadFromPreset(code, true)
}

function sync() {
    socket.emit('call-action', {action: 'sync'})
}

function sendAllProps() {
    CONTROLS.forEach(ctrl => {
        sendOSCUpdates(ctrl, preset_obj)
    })
}

function loadFromSelectedDevice() {
    const el = document.getElementById('load-from-device')
    const selid = el.options[el.selectedIndex].value
    if (selid) {
        console.log('loadFromSelectedDevice', selid)
        const fixture = all_fixtures.find(f => f.id === selid)
        console.log('loadFromSelectedDevice', fixture)
        if (fixture) {
            loadFromPresetObject(fixture.props, false)
        }
    }
}

window.addEventListener('load', () => {
    console.log('loaded.')

    CONTROLS.forEach(c => {
        if (c.id) {
            var el = document.getElementById(c.id)
            if (el) {
                // console.log('el', el, el.value)

                el.addEventListener('change', e => {
                    elementChanged(e.target)
                })

                el.addEventListener('mousemove', () => {
                    updateLabels()
                })
            }
        }
    })

    document.getElementById('load-from-preset').addEventListener('click', loadPresetFromCode);
    document.getElementById('sync').addEventListener('click', sync);
    document.getElementById('send-all-props').addEventListener('click', sendAllProps);
    document.getElementById('load-from-selected-device').addEventListener('click', loadFromSelectedDevice)

    loadFromPreset('{}', false)
    updateLabels()
    updatePresetCode()
})

var socket = io()

let all_fixtures = null
let selected_fixtures = []
let preset_obj = {}

function generatePreset() {
    let ret = {}
    ret._random = Math.floor(Math.random() * 100000)

    CONTROLS.forEach(c => {
        var el = document.getElementById(c.id)
        ret[c.prop] = ~~el.value
    })

    return ret
}

function updatePresetCode() {
    preset_obj = generatePreset()
    const code = JSON.stringify(preset_obj)
    document.getElementById('presetcode').value = code
}

function updateLabel(id) {
    var ctrl = CONTROLS.find(c => c.id === id)
    var el = document.getElementById(id)
    el.oninput()
    var el2 = document.querySelector('[data-label-for*="' + id + '"]')
    var text = ctrl.formatter !== undefined ? ctrl.formatter(el.value) : `${el.value}`
    el2.textContent = text
}

function updateColor(id) {
    let val = document.getElementById(id).value
    let layerId = id.substring(0, id.indexOf('-'))
    let layerBtn = document.getElementById(layerId)
    if (id.includes('red')) layerBtn.setAttribute('data-red', val)
    if (id.includes('green')) layerBtn.setAttribute('data-green', val)
    if (id.includes('blue')) layerBtn.setAttribute('data-blue', val)
    if (id.includes('opacity')) layerBtn.setAttribute('data-alpha', val)
    let c = {
        r: Math.ceil(layerBtn.getAttribute('data-red') * 2) || 0,
        g: Math.ceil(layerBtn.getAttribute('data-green') * 2) || 0,
        b: Math.ceil(layerBtn.getAttribute('data-blue') * 2) || 0,
        a: layerBtn.getAttribute('data-alpha') / 100 || 0
    }
    c.a = 1
    document.querySelector(':root').style.setProperty(`--${layerId}-color`, `rgba(${c.r},${c.g},${c.b},${c.a})`)
}

function updateLabels() {
    CONTROLS.forEach(c => {
        updateLabel(c.id)
    })
}

function updateColors() {
    CONTROLS.forEach(c => {
        if (c.id.match(/-red|-green|-blue|-opacity/)) {
            // console.log(c)
            updateColor(c.id)
        }
    })
}

function updateInputsFromPreset() {
    console.log('updateInputsFromPreset')

    CONTROLS.forEach(c => {
        var el = document.getElementById(c.id)
        // console.log('el2', el)
        el.value = preset_obj[c.prop]
    })
}

function loadFromPresetObject(obj, sendupdates) {
    if (obj) {
        console.log('got object', obj)

        Object.keys(obj).forEach(k => {
            var ctrl = CONTROLS.find(c => (c.prop && c.prop === k) || (c.props && c.props.indexOf(k) !== -1))

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
    updateColors()
}

function loadFromPreset(presetCode, sendupdates) {
    let obj = null
    try {
        obj = JSON.parse(presetCode)
    } catch (e) {}

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
            selected_fixtures.splice(idx, 1)
        }
    }
    console.log('new list of selected devices', selected_fixtures)
}

function updateFixtureLists() {
    var el

    el = document.getElementById('load-from-device')
    if (el) {
        // console.log('el', el)
        el.options = new Array(10)
        all_fixtures.forEach((f, i) => {
            // console.log('f', f)
            var o = new Option()
            o.value = f.id
            o.text = f.id + ' (' + f.displayname + ')'
            el.options[i] = o
        })
    }

    el = document.getElementById('devices')
    if (el) {
        // console.log('el', el)
        el.innerHTML = ''
        all_fixtures.forEach(f => {
            // console.log('f', f)
            var div = document.createElement('div')
            var lab = document.createElement('label')
            var inp = document.createElement('input')
            lab.textContent = f.id
            lab.setAttribute('for', f.id)
            inp.type = 'checkbox'
            inp.checked = true
            inp.id = f.id
            inp.addEventListener('change', updateSelectedFixtures)
            div.appendChild(inp)
            div.appendChild(lab)
            el.appendChild(div)
        })
        var clone = el.childNodes[0].cloneNode(true)
        clone.querySelector('input').id = 'all-devices'
        clone.querySelector('input').checked = true
        clone.querySelector('label').textContent = ' all'
        clone.querySelector('label').setAttribute('for', 'all-devices')
        el.insertBefore(clone, el.childNodes[0])
        clone.style.display = 'none'
    }
}

function sendOSCUpdate(ctrl, fixture, broadcast, obj) {
    if (ctrl.type === 'color') {
        ctrl.props.forEach(prop => {
            const msg = {
                fixture,
                broadcast,
                prop: prop,
                value: obj[prop]
            }
            console.log('send osc', msg)
            socket.emit('set-fixture-property', msg)
        })
    } else {
        const msg = {
            fixture,
            broadcast,
            prop: ctrl.prop,
            value: obj[ctrl.prop]
        }
        console.log('send osc', msg)
        socket.emit('set-fixture-property', msg)
    }
}

function sendOSCUpdates(ctrl, obj) {
    var broadcast = document.getElementById('all-devices').checked
    broadcast = true
    if (broadcast) {
        sendOSCUpdate(ctrl, undefined, true, obj)
    } else {
        selected_fixtures.forEach(sf => {
            sendOSCUpdate(ctrl, sf, false, obj)
        })
    }
}

function elementChanged(el) {
    updateLabels()
    updatePresetCode()
    updateColors()

    document.querySelector(':root').style.setProperty('--l1vh', window.innerHeight / 100 + 'px')

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
    socket.emit('call-action', { action: 'sync' })
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

function loadFromSelectedDevice2() {
    const el = document.getElementById('load-from-device')
    const selid = el.options[el.selectedIndex].value
    if (selid) {
        console.log('loadFromSelectedDevice', selid)
        const fixture = all_fixtures.find(f => f.id === selid)
        console.log('loadFromSelectedDevice', fixture)
        if (fixture) {
            socket.emit('call-action', { action: 'fetch-config', fixture: fixture.id })
        }
    }
}

function setAdmin() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const admin = urlParams.get('admin')
    if (admin !== null) document.documentElement.id = 'admin'
}

function savePreset() {
    var code = document.getElementById('presetcode').value
    const name = prompt('Preset name')
    if (name !== null) {
        code = JSON.parse(code)
        code.name = name
        code = JSON.stringify(code)
        console.log(code)
        socket.emit('save-preset', code)
    }
}

function loadPresets() {
    const presets = []
    const el = document.getElementById('all-presets')
    el.addEventListener('change', () => {
        var code = el.options[el.selectedIndex].value
        loadFromPreset(code, true)
        document.getElementById('presetcode').value = code
    })

    var o = new Option()
    o.text = 'select preset'
    el.appendChild(o)
    socket.emit('load-preset')
    socket.on('preset-loaded', preset => {
        presets.push(preset)
        var o = new Option()
        o.value = JSON.stringify(preset)
        o.text = preset.name || 'preset'
        el.appendChild(o)
    })
}

window.addEventListener('load', () => {
    console.log('loaded.')

    setAdmin()
    loadPresets()

    CONTROLS.forEach(c => {
        const inp = document.getElementById(c.id)
        const par = inp.parentNode
        const div = document.createElement('div')
        const lab = document.createElement('label')
        const span = document.createElement('span')
        const range = c.range || [0, 100]
        const value = c.default !== undefined ? c.default : 0.5
        inp.min = range[0]
        inp.max = range[1]
        inp.value = value * (range[0] + range[1])
        inp.classList.add('range-slider')
        inp.oninput = () => {
            // let a = inp.value
            let a = Math.round((inp.value / inp.max) * 100)
            inp.style.background = `linear-gradient(to right,var(--slider-color),var(--slider-color) ${a}%,#eee ${a}%)`
        }

        inp.oninput()
        lab.setAttribute('for', c.id)
        if (inp.hasAttribute('data-title')) {
            lab.textContent = inp.getAttribute('data-title')
        } else {
            lab.textContent = c.id.substr(c.id.lastIndexOf('-') + 1)
        }
        span.setAttribute('data-label-for', c.id)
        span.textContent = 0
        div.appendChild(lab)
        div.appendChild(span)
        par.appendChild(inp)
        par.appendChild(div)

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

    document.getElementById('load-from-preset').addEventListener('click', loadPresetFromCode)
    // document.getElementById('sync').addEventListener('click', sync)
    document.getElementById('send-all-props').addEventListener('click', sendAllProps)
    document.getElementById('save-preset').addEventListener('click', savePreset)
    document.getElementById('load-from-selected-device').addEventListener('click', loadFromSelectedDevice)
    document.getElementById('load-from-selected-device2').addEventListener('click', loadFromSelectedDevice2)

    // loadFromPreset('{}', false)
    updateLabels()
    updateColors()
    // updatePresetCode()

    window.onresize = function () {
        document.querySelector(':root').style.setProperty('--vh', window.innerHeight / 100 + 'px')
    }
    window.onresize()
})

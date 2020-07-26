var socket = io()

socket.on('lights', lights => {
    // document.body.innerHTML = ''
    console.log('lights', lights);
})

socket.on('fixtures', fixtures => {
    // document.body.innerHTML = ''

    // for each fixture

    for (fixtureKey in fixtures) {
        // create fixture fieldset
        let fixture = fixtures[fixtureKey]
        let fixtureFieldset = $('fieldset', document.body)
        let fixtureLegend = $('legend', fixtureFieldset)
        fixtureLegend.textContent = fixtureKey

        // for each object

        for (objectKey in fixture) {
            let prop = fixture[objectKey]

            // check if first value pair is an object
            if (prop[Object.keys(prop)[0]] instanceof Object) {
                // create layer fieldset
                let layerFieldset = $('fieldset', fixtureFieldset)
                let layerLegend = $('legend', layerFieldset)
                layerLegend.textContent = objectKey

                for (key in prop) {
                    let el = Input(key, prop[key], fixtureKey + '/' + objectKey)
                    layerFieldset.appendChild(el)
                }
            } else {
                let el = Input(objectKey, prop, fixtureKey)
                fixtureFieldset.appendChild(el)
            }
        }
    }
})

function $(type, parent = null) {
    let el = document.createElement(type)
    if (parent !== null) {
        parent.appendChild(el)
    }
    return el
}

function Input(name, data, addr) {
    let div = $('div')
    let label = $('label', div)
    let input = $('input', div)
    label.textContent = name
    label.setAttribute('for', name)
    input.name = name
    input.type = 'range'
    input.value = data.val
    input.setAttribute('min', data.min || 0)
    input.setAttribute('max', data.max || 100)
    input.setAttribute('list', 'tickmarks')
    input.setAttribute('step', data.step || 10)
    input.addEventListener('change', function () {
        socket.emit('update', { addr: `/${addr}/${name}`, val: input.value })
    })
    return div
}

window.addEventListener('load', () => {
    console.log('loaded')
    document.getElementById('animtest1').addEventListener('click', () => { socket.emit('test-animation', { id: 1 })})
    document.getElementById('animtest2').addEventListener('click', () => { socket.emit('test-animation', { id: 2 })})
    document.getElementById('animtest3').addEventListener('click', () => { socket.emit('test-animation', { id: 3 })})
    document.getElementById('animtest4').addEventListener('click', () => { socket.emit('test-animation', { id: 4 })})
    document.getElementById('animtest5').addEventListener('click', () => { socket.emit('test-animation', { id: 5 })})
})

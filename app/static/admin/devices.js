var socket = io()

let all_fixtures = null

const DEVICE_HTML = `
    <h2><span data-nodeprop="id"></span></h2>
    <p>Fixture IP: <b><span data-nodeprop="address"></span></b> - Uptime: <b><span data-prop="_uptime"></span> ms</b> - <button id="" data-action="fetch-config">fetch state</button></p>
    <p>
        Display name: <input type="text" data-nodeprop="displayname"></input>
    </p>

    <p>
        Strip length:
        <input data-prop="length" type="text" size="5"></input>
        (Skip first <input type="text" data-prop="skip" size="3"></input> leds)
        <input type="text" data-prop="reversed" size="3"></input>
    </p>

    <p>
        Starting ArtNet Universe: <input type="text" size="5" data-prop="artnet"></input>
    </p>

    <p>
        Pixel order:
        <select id="pixelorder" data-prop="pixelorder">
            <option value="0">R G B</option>
            <option value="1">G R B</option>
            <option value="2">G B R</option>
            <option value="3">R B G</option>
            <option value="4">B R G</option>
            <option value="5">B G R</option>
        </select>
    </p>

    <p>
        Test pattern:
        <select id="pixelorder" data-prop="testpattern">
            <option value="0">None</option>
            <option value="1">R GG BBB Test pattern</option>
            <option value="2">Light every 10</option>
            <option value="3">Slow rainbow</option>
            <option value="4">R G B ramp</option>
        </select>
    </p>
`

const handleChangeText = (e) => {
    const tgt = e.target
    const ds = combineDataset(tgt)
    console.log('change event', tgt, ds);
    if (ds.fixture) {
        socket.emit('set-fixture-property', { 
            ...ds,
            value: tgt.value,
        })
    }
}

const handleChangeDropdown = (e) => {
    const tgt = e.target
    const ds = combineDataset(tgt)
    console.log('change event', tgt, ds);
    if (ds.fixture) {
        const value = tgt.options[tgt.selectedIndex].value
        socket.emit('set-fixture-property', {
            ...ds,
            value,
        })
    }
}

const handleClickButton = (e) => {
    const tgt = e.target
    const ds = combineDataset(tgt)
    console.log('click event', tgt, ds);
    if (ds) {
        socket.emit('call-action', ds)
    }
}

const combineDataset = el => {
    let ret = {}
    while(el) {
        ret = { ...el.dataset, ...ret}
        el = el.parentNode
    }
    return ret
}

function setupTemplateFromData(root, data) {
    console.log('setupTemplateFromData', root, data)

    root.querySelectorAll('input').forEach(i => {
        // console.log('activate input', i)
        if (data) {
            var ds = combineDataset(i)
            i.addEventListener('change', handleChangeText);
            if (ds.prop) {
                i.value = data.props[ds.prop] || '';
            }
            if (ds.nodeprop) {
                i.value = data[ds.nodeprop] || '';
            }
        }
    })

    root.querySelectorAll('select').forEach(i => {
        // console.log('activate select', i)
        if (data) {
            var ds = combineDataset(i)
            i.addEventListener('change', handleChangeDropdown);
            if (ds.prop) {
                const value = data.props[ds.prop];
                // console.log('finding option with value', value, i.options)
                for(var j=0; j<i.options.length; j++) {
                    if (i.options[j].value == value) {
                        i.selectedIndex = j;
                    }
                }
            }
            if (ds.nodeprop) {
                const value = data[ds.nodeprop];
                // console.log('finding option with value', value, i.options)
                for(var j=0; j<i.options.length; j++) {
                    if (i.options[j].value == value) {
                        i.selectedIndex = j;
                    }
                }
            }
        }
    })

    root.querySelectorAll('span').forEach(i => {
        // console.log('activate span', i)
        if (data) {
            var ds = combineDataset(i)
            if (ds.prop) {
                i.textContent = data.props[ds.prop];
            }
            if (ds.nodeprop) {
                i.textContent = data[ds.nodeprop];
            }
        }
    })

    root.querySelectorAll('button').forEach(i => {
        // console.log('activate button', i)
        if (data) {
            var ds = combineDataset(i)
            i.addEventListener('click', handleClickButton);
        }
    })
}

socket.on('fixtures', fixtures => {
    console.log('Got fixtures', fixtures)

    if (!all_fixtures) {
        all_fixtures = fixtures;

        // The first time we get fixtures, we'll recreate the html template

        const ul = document.getElementById('devices');
        ul.innerHTML = ''

        all_fixtures.forEach(f => {
            const li = document.createElement('li')
            li.dataset.fixture = f.id
            li.innerHTML = DEVICE_HTML
            ul.appendChild(li)

            // then update all inputs from data
            setupTemplateFromData(li, f)
        })
    }
})

window.addEventListener('load', () => {
    console.log('loaded.')
    setupTemplateFromData(document, {})
})

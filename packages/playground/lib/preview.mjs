
let finisher = undefined

window.addEventListener('message', ({ data }) => {
    const { event, value } = data

    if (event !== 'CODE_UPDATE') return

    const next = async () => {
        window.dispose?.()
        window.dispose = undefined
        console.clear()
        await import('./index.mjs')
        Eval.evaluate(value).then((res) => {
            if (finisher) finisher()
            finisher = undefined
        })

        const load = document.getElementById('load')
        if (load) load.remove()
    }
    if (finisher !== undefined) {
        finisher = next
    } else {
        next()
    }
})

const sendToDevtools = (message) => {
    window.parent.postMessage(JSON.stringify(message), '*')
}
let id = 0
const sendToChobitsu = (message) => {
    message.id = 'tmp' + ++id
    chobitsu.sendRawMessage(JSON.stringify(message))
}
chobitsu.setOnMessage((message) => {
    if (message.includes('"id":"tmp')) return
    window.parent.postMessage(message, '*')
})
window.addEventListener('message', ({ data }) => {
    try {
        const { event, value } = data
        if (event === 'DEV') {
            chobitsu.sendRawMessage(data.data)
        } else if (event === 'LOADED') {
            sendToDevtools({
                method: 'Page.frameNavigated',
                params: {
                    frame: {
                        id: '1',
                        mimeType: 'text/html',
                        securityOrigin: location.origin,
                        url: location.href
                    },
                    type: 'Navigation'
                }
            })
            sendToChobitsu({ method: 'Network.enable' })
            sendToDevtools({ method: 'Runtime.executionContextsCleared' })
            sendToChobitsu({ method: 'Runtime.enable' })
            sendToChobitsu({ method: 'Debugger.enable' })
            sendToChobitsu({ method: 'DOMStorage.enable' })
            sendToChobitsu({ method: 'DOM.enable' })
            sendToChobitsu({ method: 'CSS.enable' })
            sendToChobitsu({ method: 'Overlay.enable' })
            sendToDevtools({ method: 'DOM.documentUpdated' })
        }
    } catch (e) {
        console.error(e)
    }
})
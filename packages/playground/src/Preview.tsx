import { Component, createEffect, createMemo, onCleanup, untrack } from 'solid-js'

type Props = {
    code: string
    reloadSignal: boolean
    devtools?: boolean
}

export const Preview: Component<Props> = (props) => {
    let iframe!: HTMLIFrameElement
    let devtoolsIframe!: HTMLIFrameElement
    let outerContainer!: HTMLDivElement

    let devtoolsLoaded = false
    let isIframeReady = false

    // This is the createWriteable paradigm in action
    // We have that the iframe src is entangled with its loading state
    const iframeSrcUrl = createMemo(() => {
        return '/preview.html'
    })

    createEffect(() => {
        if (!props.reloadSignal) return

        isIframeReady = false
        iframe.src = untrack(iframeSrcUrl)
    })

    createEffect(() => {
        const codeURL = props.code

        if (!isIframeReady) return

        iframe.contentWindow!.postMessage({ event: 'CODE_UPDATE', value: codeURL }, '*')
    })

    const messageListener = (event: MessageEvent) => {
        if (event.source === iframe.contentWindow) {
            devtoolsIframe.contentWindow!.postMessage(event.data, '*')
        }
        if (event.source === devtoolsIframe.contentWindow) {
            iframe.contentWindow!.postMessage({ event: 'DEV', data: event.data }, '*')
        }
    }
    window.addEventListener('message', messageListener)
    onCleanup(() => window.removeEventListener('message', messageListener))

    createEffect(() => {
        devtoolsIframe.contentWindow!.location.reload()
    })
    return (
        <div class="flex flex-1 flex-col" ref={outerContainer}>
            <div class="flex-1">
                <iframe
                    title="Solid REPL"
                    class="dark:bg-other block h-full w-full overflow-scroll bg-white p-0"
                    ref={iframe}
                    src={iframeSrcUrl()}
                    onload={() => {
                        isIframeReady = true
                        console.log('Iframe ready')
                        if (devtoolsLoaded) iframe.contentWindow!.postMessage({ event: 'LOADED' }, '*')
                        if (props.code) iframe.contentWindow!.postMessage({ event: 'CODE_UPDATE', value: props.code }, '*')
                    }}
                    // @ts-ignore
                    sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
                />
            </div>
            <div class="flex-1">
                <iframe
                    title="Devtools"
                    class="h-full w-full"
                    ref={devtoolsIframe}
                    src={`/devtools.html#?embedded=${encodeURIComponent(location.origin)}`}
                    onload={() => (devtoolsLoaded = true)}
                />
            </div>
        </div>
    )
}

import { createMemo, onCleanup } from 'solid-js'

import { Uri, editor, IDisposable } from 'monaco-editor'
interface Tab {
    id: string
    source: string
    name: string
}
export const createMonacoTabs = (tabs: () => Tab[], onChange: (tab: Tab, source: string) => void) => {
    const currentTabs = createMemo<Map<string, { model: editor.ITextModel; watcher: IDisposable }>>((prevTabs) => {
        const newTabs = new Map<string, { model: editor.ITextModel; watcher: IDisposable }>()
        for (const tab of tabs()) {
            const url = tab.id
            const lookup = prevTabs?.get(url)
            if (!lookup) {
                const uri = Uri.parse(url)
                const model = editor.createModel(tab.source, undefined, uri)
                const watcher = model.onDidChangeContent(() => onChange(tab, model.getValue()))
                newTabs.set(url, { model, watcher })
            } else {
                lookup.model.setValue(tab.source)
                lookup.watcher.dispose()
                lookup.watcher = lookup.model.onDidChangeContent(() => (tab.source = lookup.model.getValue()))
                newTabs.set(url, lookup)
            }
        }

        if (prevTabs) {
            for (const [old, lookup] of prevTabs) {
                if (!newTabs.has(old)) lookup.model.dispose()
            }
        }
        return newTabs
    })
    onCleanup(() => {
        for (const lookup of currentTabs().values()) lookup.model.dispose()
    })

    return currentTabs
}

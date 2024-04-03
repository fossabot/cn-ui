import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import onigasm from 'onigasm/lib/onigasm.wasm?url'
import { languages } from 'monaco-editor'

const solidTypes: Record<string, string> = import.meta.glob('/node_modules/{solid-js,csstype}/**/*.{d.ts,json}', {
    eager: true,
    query: '?raw',
    import: 'default'
})

for (const path in solidTypes) {
    languages.typescript.typescriptDefaults.addExtraLib(solidTypes[path], `file://${path}`)
    languages.typescript.javascriptDefaults.addExtraLib(solidTypes[path], `file://${path}`)
}

window.MonacoEnvironment = {
    getWorker(_moduleId: unknown, label: string) {
        switch (label) {
            case 'css':
                return new cssWorker()
            case 'json':
                return new jsonWorker()
            case 'typescript':
            case 'javascript':
                return new tsWorker()
            default:
                return new editorWorker()
        }
    },
    onigasm
}

import { render } from 'solid-js/web'
import { Preview } from './Preview'
import 'virtual:uno.css'
import { Editor } from './Editor'
import { createMonacoTabs } from './Tabs'
import { atom, computed } from '@cn-ui/reactive'
import { createEffect } from 'solid-js'
const App = () => {
    const files = () => [
        {
            id: 'file:///demo/init.tsx',
            name: 'init.tsx',
            source: `import { render } from "solid-js/web";
    import { MyComponent } from './test'
    render(MyComponent, document.body)
    console.log("渲染完成")`
        },
        {
            id: 'file:///demo/test.tsx',
            name: 'test.tsx',
            source: `export const MyComponent = () => {
            return <div>Hello World </div>
        }`
        }
    ]
    const models = createMonacoTabs(files, (tab, item) => {
        console.log(item)
    })
    const watchingModel = atom('file:///demo/init.tsx')
    const model = computed(() => models().get(watchingModel()))
    createEffect(() => console.log(model()))
    return (
        <section class="w-screen h-screen flex ">
            <div class="flex-1">
                <ul>
                    {files().map((i) => {
                        return (
                            <li
                                onclick={() => {
                                    watchingModel(i.id)
                                }}
                            >
                                {i.name}
                            </li>
                        )
                    })}
                </ul>
                <div class="flex flex-col h-full">
                    <Editor model={model()!.model}></Editor>
                </div>
            </div>
            <Preview code="/public/init.ts"></Preview>
        </section>
    )
}
render(App, document.body)

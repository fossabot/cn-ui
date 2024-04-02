import type { JSXElement } from 'solid-js'

export const CodeExample = (props: { children?: JSXElement }) => {
    return <section class="w-full max-h-84 rounded-xl border border-solid border-gray-300 p-4">{props.children}</section>
}

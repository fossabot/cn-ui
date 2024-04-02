import { createSignal } from 'solid-js'

import { MaybeElementAccessor, UseFocusOptions, toAccessor, useEventListener } from 'solidjs-use'

/**
 * 监听 focusin 和 focusout 事件，判断内部元素是否 focus 的方法
 */
export function useFocusIn(target: MaybeElementAccessor, options: UseFocusOptions = {}) {
    const { focusVisible = false } = options

    const [innerFocused, setInnerFocused] = createSignal(false)
    const targetElement = toAccessor(target)

    useEventListener(targetElement, 'focusin', (event) => {
        if (!focusVisible || (event.target as HTMLElement).matches?.(':focus-visible')) setInnerFocused(true)
    })
    useEventListener(targetElement, 'focusout', () => setInnerFocused(false))

    return [innerFocused]
}

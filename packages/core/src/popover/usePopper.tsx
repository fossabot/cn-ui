import { Atom } from '@cn-ui/reactive'
import { onCleanup, onMount } from 'solid-js'
import type { Instance } from '@popperjs/core/lib/popper-lite'
import { createPopper } from './createPopper'
import { PopperProps } from './Popper'
import { isServer } from 'solid-js/web'

/** 对于 Popper js 的封装 */
export function usePopper(
    target: Atom<HTMLElement>,
    popoverContent: Atom<HTMLElement | null>,
    arrow: Atom<HTMLElement | null>,
    getOptions: () => Partial<PopperProps>,
    props: PopperProps
) {
    let popperInstance: Instance
    onMount(() => {
        if (isServer) return
        if (props.popoverTarget) {
            const el = document.querySelector(props.popoverTarget)! as HTMLElement
            if (el) {
                target(el)
            } else {
                throw new Error("Popover | can't find element " + props.popoverTarget)
            }
        }
        popperInstance = createPopper(target() as Element, popoverContent() as HTMLElement, {
            ...getOptions(),
            modifiers: [
                {
                    name: 'arrow',
                    options: {
                        element: arrow(),
                        padding: 20
                    }
                },
                {
                    name: 'offset',
                    options: {
                        offset: [0, 10]
                    }
                }
            ]
        })
    })

    const updatingOptions = () => {
        return [{ name: 'sameWidth', enabled: !!getOptions().sameWidth }]
    }
    function show() {
        if (getOptions().disabled) return

        // Enable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [...(options.modifiers as any[]), ...updatingOptions(), { name: 'eventListeners', enabled: true }]
        }))

        // Update its position
        popperInstance.update()
    }

    function hide() {
        if (getOptions().disabled) return

        // Disable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [...(options.modifiers as any[]), ...updatingOptions(), { name: 'eventListeners', enabled: false }]
        }))
    }
    onCleanup(() => popperInstance && popperInstance.destroy())
    return { show, hide }
}

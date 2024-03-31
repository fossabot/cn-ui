import { Atom, JSXSlot, NullAtom, OriginComponent, atom, computed, ensureFunctionResult, ensureOnlyChild } from '@cn-ui/reactive'
import { createEffect, onCleanup, onMount } from 'solid-js'
import { popperGenerator, defaultModifiers } from '@popperjs/core/lib/popper-lite'
import flip from '@popperjs/core/lib/modifiers/flip'
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow'
import Arrow from '@popperjs/core/lib/modifiers/arrow'

const createPopper = popperGenerator({
    defaultModifiers: [...defaultModifiers, flip, preventOverflow, Arrow]
})
import { Instance } from '@popperjs/core/lib/popper-lite'
import { isServer } from 'solid-js/web'
import './index.css'
import { usePopoverHover } from './usePopoverHover'
import { onClickOutside, useEventListener } from 'solidjs-use'

export interface PopperProps {
    content: JSXSlot
    trigger?: 'click' | 'hover' | 'none'
    options?: Parameters<typeof createPopper>[2]
}
export const Popper = OriginComponent<PopperProps>((props) => {
    const child = ensureOnlyChild(() => props.children) as () => HTMLElement
    const popoverContent = NullAtom<HTMLElement>(null)
    const arrow = NullAtom<HTMLElement>(null)
    const { show, hide } = usePopper(child, popoverContent, arrow)

    // hover
    const { hovering } = usePopoverHover([child, popoverContent])

    // click
    const clickState = atom(false)
    useEventListener(child, 'pointerdown', () => {
        clickState((i) => !i)
    })
    onClickOutside(popoverContent, () => (!props.trigger || props.trigger === 'click') && clickState(false), {
        ignore: [child]
    })
    const showing = computed(() => {
        switch (props.trigger) {
            case 'hover':
                return hovering()
            case 'none':
                return props.model()
            case 'click':
            default:
                return clickState()
        }
    })
    createEffect(() => (showing() ? show() : hide()))

    return (
        <>
            {child()}
            {!isServer && (
                <div ref={popoverContent} class="hidden popover__content bg-design-title text-design-pure p-1 rounded-md" role="tooltip">
                    <div data-popper-arrow class="popover__arrow" ref={arrow}>
                        <div class="popover__arrowTip"></div>
                    </div>
                    {ensureFunctionResult(props.content)}
                </div>
            )}
        </>
    )
})

/** 对于 Popper js 的封装 */
function usePopper(child: () => HTMLElement, popoverContent: Atom<HTMLElement | null>, arrow: Atom<HTMLElement | null>) {
    let popperInstance: Instance
    onMount(() => {
        popperInstance = createPopper(child() as Element, popoverContent() as HTMLElement, {
            modifiers: [
                {
                    name: 'arrow',
                    options: {
                        element: arrow()
                    }
                }
            ]
        })
    })
    function show() {
        // Make the tooltip visible
        popoverContent()!.classList.remove('hidden')

        // Enable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [...options.modifiers, { name: 'eventListeners', enabled: true }]
        }))

        // Update its position
        popperInstance.update()
    }

    function hide() {
        // Hide the tooltip
        popoverContent()!.classList.add('hidden')

        // Disable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [...options.modifiers, { name: 'eventListeners', enabled: false }]
        }))
    }
    onCleanup(() => popperInstance && popperInstance.destroy())
    return { show, hide }
}

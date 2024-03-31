import { Atom, JSXSlot, NullAtom, OriginComponent, atom, ensureFunctionResult, ensureOnlyChild } from '@cn-ui/reactive'
import { createEffect, createMemo, onCleanup, onMount } from 'solid-js'
import { popperGenerator, defaultModifiers } from '@popperjs/core/lib/popper-lite'
import flip from '@popperjs/core/lib/modifiers/flip'
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow'
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles'
import Arrow from '@popperjs/core/lib/modifiers/arrow'
import Offset from '@popperjs/core/lib/modifiers/offset'

const createPopper = popperGenerator({
    defaultModifiers: [
        ...defaultModifiers,
        flip,
        preventOverflow,
        Arrow,
        Offset,
        computeStyles,
        {
            name: 'sameWidth',
            enabled: false,
            phase: 'beforeWrite',
            requires: ['computeStyles'],
            fn: ({ state }) => {
                state.styles.popper.width = `${state.rects.reference.width}px`
            },
            effect: ({ state }) => {
                state.elements.popper.style.width = `${(state.elements.reference as any).offsetWidth}px`
            }
        }
    ]
})
import type { Instance } from '@popperjs/core/lib/popper-lite'
import { isServer } from 'solid-js/web'
import './index.css'
import { usePopoverHover } from './usePopoverHover'
import { onClickOutside, useEventListener } from 'solidjs-use'
import type { Placement } from '@popperjs/core'
import { pick } from 'lodash-es'
import { useFocusIn } from './useFocusIn'

export interface PopperProps {
    content: JSXSlot
    trigger?: 'click' | 'hover' | 'focus' | 'none'
    placement?: Placement
    disabled?: boolean
    sameWidth?: boolean
    clickOutsideClose?: boolean
}
export const Popper = OriginComponent<PopperProps, HTMLElement, boolean>(
    (props) => {
        const child = ensureOnlyChild(() => props.children) as () => HTMLElement
        if (isServer) return <>{child()}</>
        const popoverContent = NullAtom<HTMLElement>(null)
        const arrow = NullAtom<HTMLElement>(null)
        const { show, hide } = usePopper(
            child,
            popoverContent,
            arrow,
            createMemo(() => pick(props, 'placement', 'disabled', 'sameWidth'))
        )

        // hover
        const { hovering, hoveringState } = usePopoverHover([child, popoverContent])
        const contentHovering = hoveringState[1]
        const [focused] = useFocusIn(child)
        // click
        const clickState = atom(false)
        useEventListener(child, 'pointerdown', () => clickState((i) => !i))
        onClickOutside(
            popoverContent,
            () => {
                if (props.model() === true && props.clickOutsideClose !== false) {
                    props.model(false)
                }
            },
            {
                ignore: [child]
            }
        )
        // 此处进行对 model 数据的统一
        createEffect(() => {
            switch (props.trigger) {
                case 'hover':
                    return props.model(() => hovering())
                case 'focus':
                    return props.model(() => focused() || contentHovering())
                case 'none':
                    return
                case 'click':
                default:
                    return props.model(() => clickState())
            }
        })
        createEffect(() => (props.model() ? show() : hide()))

        return (
            <>
                {child()}
                <div
                    ref={(el) => {
                        popoverContent(el)
                        props.ref?.(el)
                    }}
                    class={props.class('hidden popover__content p-1 rounded-md')}
                    style={props.style()}
                    role="tooltip"
                >
                    <div class="popover__arrow" ref={arrow}></div>
                    {ensureFunctionResult(props.content)}
                </div>
            </>
        )
    },
    {
        modelValue: false
    }
)

/** 对于 Popper js 的封装 */
function usePopper(
    child: () => HTMLElement,
    popoverContent: Atom<HTMLElement | null>,
    arrow: Atom<HTMLElement | null>,
    getOptions: () => Partial<PopperProps>
) {
    let popperInstance: Instance
    onMount(() => {
        popperInstance = createPopper(child() as Element, popoverContent() as HTMLElement, {
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
        // Make the tooltip visible
        popoverContent()!.classList.remove('hidden')

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
        // Hide the tooltip
        popoverContent()!.classList.add('hidden')

        // Disable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [...(options.modifiers as any[]), ...updatingOptions(), { name: 'eventListeners', enabled: false }]
        }))
    }
    onCleanup(() => popperInstance && popperInstance.destroy())
    return { show, hide }
}

import { Atom, JSXSlot, NullAtom, OriginComponent, atom, computed, ensureFunctionResult, ensureOnlyChild } from '@cn-ui/reactive'
import { createEffect, createMemo } from 'solid-js'
import { isServer } from 'solid-js/web'
import './index.css'
import { usePopoverHover } from './composable/usePopoverHover'
import { onClickOutside, useEventListener } from 'solidjs-use'
import type { Placement } from '@popperjs/core'
import { pick } from 'lodash-es'
import { useFocusIn } from './composable/useFocusIn'
import { usePopper } from './usePopper'

export interface PopperProps {
    content: JSXSlot<{ model: Atom<boolean> }>
    trigger?: 'click' | 'hover' | 'focus' | 'none'
    placement?: Placement
    disabled?: boolean
    sameWidth?: boolean
    clickOutsideClose?: boolean
    /** 支持通过 CSS 选择器直接虚拟链接对象, */
    popoverTarget?: string
}

export const Popper = OriginComponent<PopperProps, HTMLElement, boolean>(
    (props) => {
        const child = ensureOnlyChild(() => props.children) as unknown as Atom<HTMLElement>
        if (isServer) return <>{child()}</>
        const popoverContent = NullAtom<HTMLElement>(null)
        // fix: 封装一层 child 避免初始化时序混乱
        const popoverTarget = computed(() => child())
        const arrow = NullAtom<HTMLElement>(null)
        const { show, hide } = usePopper(
            popoverTarget,
            popoverContent,
            arrow,
            createMemo(() => pick(props, 'placement', 'disabled', 'sameWidth')),
            props
        )

        // hover
        const { hovering, hoveringState } = usePopoverHover([popoverTarget, popoverContent])
        const contentHovering = hoveringState[1]
        const [focused] = useFocusIn(popoverTarget)
        // click
        const clickState = atom(false)
        useEventListener(popoverTarget, 'pointerdown', () => clickState((i) => !i))
        onClickOutside(
            popoverContent,
            () => {
                if (props.model() === true && props.clickOutsideClose !== false) {
                    props.model(false)
                }
            },
            {
                ignore: [popoverTarget]
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
                    class={props.class('hidden popover__content bg-design-pure p-1 rounded-md')}
                    style={props.style()}
                    role="tooltip"
                >
                    <div class="popover__arrow" ref={arrow}></div>
                    {ensureFunctionResult(props.content, [{ model: props.model }])}
                </div>
            </>
        )
    },
    {
        modelValue: false
    }
)

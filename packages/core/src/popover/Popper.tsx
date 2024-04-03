import { Atom, JSXSlot, NullAtom, OriginComponent, computed, ensureFunctionResult, splitOneChild } from '@cn-ui/reactive'
import { createEffect, createMemo } from 'solid-js'
import './index.css'
import { usePopoverHover } from './composable/usePopoverHover'
import { onClickOutside, useEventListener } from 'solidjs-use'
import type { Placement } from '@popperjs/core'
import { pick } from 'lodash-es'
import { useFocusIn } from './composable/useFocusIn'
import { usePopper } from './usePopper'
import { zIndexManager } from './zIndexManager'

export interface PopperProps {
    content: JSXSlot<{ model: Atom<boolean> }>
    /**
     * click: 点击触发
     * hover: 鼠标移入触发
     * focus: 聚焦触发（未实现）
     * none: 完全受控模式
     */
    trigger?: 'click' | 'hover' | 'focus' | 'none'
    placement?: Placement
    disabled?: boolean
    sameWidth?: boolean
    clickOutsideClose?: boolean
    /** 支持通过 CSS 选择器直接虚拟链接对象, */
    popoverTarget?: string
    zIndex?: number
}

export const Popper = OriginComponent<PopperProps, HTMLElement, boolean>(
    (props) => {
        const [child, otherChildren] = splitOneChild(() => props.children)

        const popoverContent = NullAtom<HTMLElement>(null)
        // fix: 封装一层 child 避免初始化时序混乱
        const popoverTarget = computed(() => child() as HTMLElement)

        const arrow = NullAtom<HTMLElement>(null)
        const { show, hide } = usePopper(
            popoverTarget,
            popoverContent,
            arrow,
            // 单独构建 atom 给配置，用于单独引用
            createMemo(() => pick(props, 'placement', 'disabled', 'sameWidth')),
            props
        )

        // hover
        const { hovering, hoveringState } = usePopoverHover([popoverTarget, popoverContent])
        const contentHovering = hoveringState[1]
        const [focused] = useFocusIn(popoverTarget)
        // click
        useEventListener(popoverTarget, 'pointerdown', () => (props.trigger === 'click' || !props.trigger) && props.model((i) => !i))
        onClickOutside(popoverContent, () => props.model() && props.clickOutsideClose !== false && props.trigger !== 'none' && props.model(false), {
            ignore: [popoverTarget]
        })
        // 此处进行对 model 动态数据的统一
        createEffect(() => {
            switch (props.trigger) {
                case 'hover':
                    return props.model(() => hovering())
                case 'focus':
                    return props.model(() => focused() || contentHovering())
                case 'none':
                    return
            }
        })
        createEffect(() => (props.model() ? show() : hide()))

        const zIndex = computed(() => props.zIndex ?? zIndexManager.getIndex())
        createEffect(() => props.model() && zIndex(zIndexManager.getIndex()))

        // TODO 希望在水合之前隐藏，在水合之后显示
        const isHidden = computed(() => !props.model())

        return (
            <>
                {child()}
                {otherChildren()}
                <div
                    ref={(el) => {
                        popoverContent(el)
                        props.ref?.(el)
                    }}
                    class={props.class(isHidden() && 'hidden', 'absolute popover__content bg-design-pure p-1 rounded-md')}
                    style={{ ...props.style(), 'z-index': zIndex() }}
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

import { classNames, firstClass } from '@cn-ui/reactive'
import { useEventListener } from 'solidjs-use'
import { For, createEffect, createMemo } from 'solid-js'
import { VirtualList } from '../virtualList'
import { Icon } from '../icon/Icon'
import { AiOutlineCheck } from 'solid-icons/ai'
import { SelectOptionsType } from '@cn-ui/reactive'
import { SelectCtx } from './Select'

/** 可选列表面板，需要依赖 useSelect 环境 */

export const SelectPanel = (props: {
    /** 禁用点击选中状态 取消选择 */
    disallowCancelClick?: boolean
    options: SelectOptionsType[]
    onSelect?: (item: SelectOptionsType, state: boolean) => void
}) => {
    const selectSystem = SelectCtx.use()
    const innerContent = (item: SelectOptionsType) => (
        <>
            <Icon class="col-span-4">{selectSystem.isSelected(item) && <AiOutlineCheck></AiOutlineCheck>}</Icon>
            <span class="col-span-8">{item.label ?? item.value}</span>
        </>
    )

    const createClass = (item: SelectOptionsType) => {
        const isSelected = selectSystem.isSelected(item)
        const isDisabled = selectSystem.isDisabled(item)
        return firstClass.base('cn-select-option grid grid-cols-12 items-center transition-colors select-none px-2 rounded-md')(
            isSelected && 'cn-selected bg-primary-500 text-white hover:bg-primary-600 cursor-pointer',
            isDisabled && 'text-gray-400 cursor-not-allowed',
            'hover:bg-design-hover cursor-pointer'
        )
    }
    const triggerSelect = (item: SelectOptionsType) => {
        if (props.disallowCancelClick && selectSystem.isSelected(item)) {
            return
        }
        const state = selectSystem.toggle(item)
        props.onSelect?.(item, state)
    }
    const isVirtual = createMemo(() => props.options.length > 100)
    const VoidSlot = () => <span>无数据</span>
    return (
        <nav class={classNames('max-h-32 w-full ', isVirtual() ? 'h-32' : 'overflow-y-auto')}>
            {isVirtual() ? (
                <VirtualList containerHeight={128} each={props.options} estimateSize={24} fallback={VoidSlot}>
                    {(item, _, { itemClass, itemRef }) => {
                        createEffect(() => {
                            itemClass(createClass(item))
                            useEventListener(itemRef, 'click', () => {
                                triggerSelect(item)
                            })
                        })
                        return <>{innerContent(item)}</>
                    }}
                </VirtualList>
            ) : (
                <For each={props.options} fallback={VoidSlot()}>
                    {(item) => {
                        return (
                            <div
                                role="option"
                                class={createClass(item)}
                                onClick={() => {
                                    triggerSelect(item)
                                }}
                            >
                                {innerContent(item)}
                            </div>
                        )
                    }}
                </For>
            )}
        </nav>
    )
}

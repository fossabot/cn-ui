import { Atom, useSelect } from '@cn-ui/reactive'
import { SelectOptionsType, SelectSystem } from '../hook/useSelect'
import { For, JSXElement } from 'solid-js'
import { DynamicListReturn, useDynamicList } from '../hook/useDynamicList'
import { useSelectItem } from '@cn-ui/reactive/src/hook/useSelectItem'

export interface SelectableListExpose {
    selectSystem: SelectSystem<SelectOptionsType>
    dynamicList: DynamicListReturn<SelectOptionsType>
}
/**
 * JSX 无关的可选元素封装，类似于 JSX 无关的 tags 组件
 */
export const SelectableList = (props: {
    options: Atom<SelectOptionsType[]>
    children: (
        item: SelectOptionsType,
        selectItem: ReturnType<typeof useSelectItem>,
        others: {
            index: () => number
            selectSystem: SelectSystem<SelectOptionsType>
            dynamicList: DynamicListReturn<SelectOptionsType>
        }
    ) => JSXElement
    expose?: () => SelectableListExpose
}) => {
    const selectSystem = useSelect(() => props.options(), { multi: () => false })
    const dynamicList = useDynamicList(props.options)
    return (
        <For each={selectSystem.options()}>
            {(item, index) => {
                const selectItem = useSelectItem(selectSystem, item)
                return props.children(item, selectItem, { index, selectSystem, dynamicList })
            }}
        </For>
    )
}

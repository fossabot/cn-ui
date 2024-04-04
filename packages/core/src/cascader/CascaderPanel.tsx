import { OriginComponent, OriginDiv, atom, classNames } from '@cn-ui/reactive'
import { For, Show } from 'solid-js'
import { CommonGroupListConfig } from '../groupList'
import { Dynamic } from 'solid-js/web'
import { AiOutlineRight } from 'solid-icons/ai'
import { Icon } from '../icon'

type SelectedEvent = (checked: CommonGroupListConfig, isLeaf: boolean) => void

export interface CascaderPanelProps {
    options: CommonGroupListConfig[]
    onSelected?: SelectedEvent
}
export const CascaderPanel = OriginComponent<CascaderPanelProps, HTMLDivElement, CommonGroupListConfig[]>((props) => {
    return (
        <OriginDiv prop={props} class="border rounded-md flex select-none">
            <For each={[null, ...props.model()]}>
                {(item, index) => {
                    const options = item === null ? props.options : item.options
                    return (
                        <Show when={options}>
                            <Dynamic
                                component={CascaderColumn}
                                options={options!}
                                selected={props.model()[index()]}
                                onSelected={(checked: CommonGroupListConfig, isLeaf: boolean) => {
                                    props.model((i) => {
                                        const newArr = i.slice(0, index())
                                        newArr[index()] = checked
                                        console.log(newArr)
                                        return newArr
                                    })
                                    props.onSelected?.(checked, isLeaf)
                                }}
                            ></Dynamic>
                        </Show>
                    )
                }}
            </For>
        </OriginDiv>
    )
})
export const CascaderColumn = (props: { selected?: CommonGroupListConfig | null; options: CommonGroupListConfig[]; onSelected: SelectedEvent }) => {
    return (
        <div class="p-2 flex flex-col border-r text-left">
            <For each={props.options}>
                {(item) => {
                    return (
                        <div
                            class={classNames(
                                props.selected === item && 'bg-primary-500 text-white',
                                'flex justify-between px-1 mx-1 py-1 rounded-md hover:bg-primary-600  hover:text-white transition-colors cursor-pointer items-center'
                            )}
                            onclick={() => props.onSelected(item, !item.options)}
                        >
                            <span>{item.label}</span>

                            <Show when={item.options}>
                                <Icon class="pl-1">
                                    <AiOutlineRight></AiOutlineRight>
                                </Icon>
                            </Show>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

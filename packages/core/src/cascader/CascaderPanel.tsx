import { OriginComponent, OriginDiv, atom, classNames } from '@cn-ui/reactive'
import { For, Show } from 'solid-js'
import { CommonGroupListConfig } from '../groupList'
import { Dynamic } from 'solid-js/web'
import { AiOutlineRight } from 'solid-icons/ai'
import { Icon } from '../icon'

export interface CascaderPanelProps {
    options: CommonGroupListConfig[]
}
export const CascaderPanel = OriginComponent<CascaderPanelProps>((props) => {
    const selected = atom<(CommonGroupListConfig | null)[]>([null])
    return (
        <OriginDiv prop={props} class="border rounded-md flex ">
            <For each={selected()}>
                {(item, index) => {
                    const options = item === null ? props.options : item.options
                    return (
                        <Show when={options}>
                            <Dynamic
                                component={CascaderColumn}
                                options={options!}
                                selected={selected()[index() + 1]}
                                onSelect={(checked: CommonGroupListConfig | null, isLeaf: boolean) =>
                                    isLeaf &&
                                    selected((i) => {
                                        const newArr = i.slice(0, index() + 1)
                                        newArr[index() + 1] = checked
                                        return newArr
                                    })
                                }
                            ></Dynamic>
                        </Show>
                    )
                }}
            </For>
        </OriginDiv>
    )
})
export const CascaderColumn = (props: {
    selected?: CommonGroupListConfig | null
    options: CommonGroupListConfig[]
    onSelect: (selected: CommonGroupListConfig, isLeaf: boolean) => void
}) => {
    return (
        <div class="p-2 flex flex-col border-r text-left">
            <For each={props.options}>
                {(item) => {
                    return (
                        <div
                            class={classNames(
                                props.selected === item && 'bg-primary-500 text-white',
                                'flex justify-between px-2 py-1 rounded-md hover:bg-primary-600  hover:text-white transition-colors cursor-pointer items-center'
                            )}
                            onclick={() => props.onSelect(item, !!item.options)}
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

import { OriginComponent, OriginDiv, classNames, useSelect } from '@cn-ui/reactive'
import { For, Show } from 'solid-js'
import { CommonGroupListConfig } from '../groupList'
import { Dynamic } from 'solid-js/web'
import { AiOutlineRight } from 'solid-icons/ai'
import { Icon } from '../icon'
import { SelectPanel } from '../select/SelectPanel'
import { SelectCtx } from '../select'

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
                    if (!options) return null
                    const selectSystem = useSelect(() => options!, {
                        multi: () => false
                    })
                    return (
                        <SelectCtx.Provider value={selectSystem}>
                            <SelectPanel
                                class="p-2 border-r"
                                disallowCancelClick
                                options={options!}
                                onSelected={(item) => {
                                    props.model((i) => {
                                        const newArr = i.slice(0, index())
                                        newArr[index()] = item
                                        console.log(newArr)
                                        return newArr
                                    })
                                }}
                                rightSlot={(item: CommonGroupListConfig | undefined) => (
                                    <Icon class="w-6 px-1 flex-none">
                                        <Show when={item?.options}>
                                            <AiOutlineRight></AiOutlineRight>
                                        </Show>
                                    </Icon>
                                )}
                            ></SelectPanel>
                        </SelectCtx.Provider>
                    )
                }}
            </For>
        </OriginDiv>
    )
})

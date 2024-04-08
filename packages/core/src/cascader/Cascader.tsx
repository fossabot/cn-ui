import { atom, NullAtom, OriginComponent, OriginDiv } from '@cn-ui/reactive'
import { CascaderPanel, CascaderPanelProps } from './CascaderPanel'
import { CommonGroupListConfig } from '../groupList'
import { Popover, PopoverExpose } from '../popover'
import { BaseInput } from '../input'
import { createMemo } from 'solid-js'
import { watch } from 'solidjs-use'

export interface CascaderProps extends CascaderPanelProps {}
export const Cascader = OriginComponent<CascaderProps, HTMLDivElement, CommonGroupListConfig[]>((props) => {
    const show = atom(false)
    const input = NullAtom<HTMLInputElement>(null)
    const inputWrapper = NullAtom<HTMLSpanElement>(null)
    /** readonly input text */
    const inputText = createMemo(() =>
        props
            .model()
            .map((item) => item.label)
            .join(' / ')
    )
    // 使 Popover 跟随移动
    const popoverInstance = NullAtom<PopoverExpose>(null)
    watch(props.model, () => popoverInstance()?.update())
    return (
        <OriginDiv prop={props}>
            <BaseInput ref={input} wrapperRef={inputWrapper} v-model={inputText}></BaseInput>
            <Popover
                placement="bottom-start"
                class="p-none"
                v-model={show}
                trigger="focus"
                expose={popoverInstance}
                popoverTarget={inputWrapper()!}
                content={<CascaderPanel options={props.options} v-model={props.model} onSelected={props.onSelected}></CascaderPanel>}
            ></Popover>
        </OriginDiv>
    )
})

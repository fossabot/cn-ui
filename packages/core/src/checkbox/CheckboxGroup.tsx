import { Atom, OriginComponent, computed, useSelect } from '@cn-ui/reactive'
import { For, createEffect } from 'solid-js'
import { CheckboxProps, CheckboxGroupCtx, Checkbox } from './Checkbox'
import { BaseFormItemType, extendsBaseFormItemProp } from '../form/BaseFormItemType'
import { SelectItemsType } from '../select'

export interface CheckboxGroupExpose extends ReturnType<typeof useSelect<SelectItemsType>> {}
export interface CheckboxGroupProps extends BaseFormItemType {
    options: CheckboxProps[]
    expose?: (expose: CheckboxGroupExpose) => void
    multiple?: boolean
}

export const CheckboxGroup = OriginComponent<CheckboxGroupProps, HTMLElement, string[]>((props) => {
    !Array.isArray(props.model()) && props.model([])
    const selectSetting = useSelect<SelectItemsType>(() => props.options, {
        multi: () => props.multiple ?? true
    })
    createEffect(() => {
        props.model(() => selectSetting.selected().map((i) => selectSetting.getId(i)))
    })
    const options = computed(() => {
        if (typeof props.options[0] === 'object') {
            return props.options as CheckboxProps[]
        } else {
            return props.options.map((i) => ({ value: i.toString(), label: i.toString() }))
        }
    })
    props.expose?.(selectSetting)
    return (
        <CheckboxGroupCtx.Provider value={selectSetting}>
            <For each={options()}>
                {(config) => {
                    return <Checkbox {...extendsBaseFormItemProp(props)} {...config}></Checkbox>
                }}
            </For>
        </CheckboxGroupCtx.Provider>
    )
})
/** 全选不选按钮的 hook */
export const useControlCheckbox = (checkBoxCtx: Atom<CheckboxGroupExpose | null>) => {
    const isAllChecked = computed(() => checkBoxCtx()?.isAllSelected() ?? false)
    return {
        isAllChecked,
        indeterminate: computed(() => checkBoxCtx()?.isIndeterminate()),
        onChange() {
            const val = checkBoxCtx()?.isAllSelected()
            if (val || checkBoxCtx()?.isIndeterminate()) {
                return checkBoxCtx()?.clearAll()
            } else {
                return checkBoxCtx()?.selectAll()
            }
        }
    }
}

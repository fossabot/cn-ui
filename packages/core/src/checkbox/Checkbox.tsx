import { OriginComponent, classNames, computed, createCtx, extendsEvent, useMapper, useSelect } from '@cn-ui/reactive'
import { BaseFormItemType, extendsBaseFormItemProp } from '../form/BaseFormItemType'
import { SelectItemsType } from '../select'

export type CheckboxGroupCtxType = ReturnType<typeof useSelect<SelectItemsType>>
export const CheckboxGroupCtx = /* @__PURE__ */ createCtx<CheckboxGroupCtxType>({} as any)

export interface CheckboxProps extends BaseFormItemType, SelectItemsType {
    indeterminate?: boolean
}
export const Checkbox = OriginComponent<CheckboxProps, HTMLInputElement, boolean>((props) => {
    const group = CheckboxGroupCtx.use()
    const inputType = computed(() => (group?.multi?.() === false ? 'radio' : 'checkbox'))
    const isChecked = computed(() => group?.isSelectedById?.(props.value.toString()) ?? props.model())
    const inputClass = useMapper(inputType, {
        radio() {
            const [base] = this.base()
            return ['border-design-border', 'border-primary-500'].map((i) => base + i)
        },
        checkbox() {
            const base = this.base()[1]
            if (props.indeterminate) return ['border-primary-600', 'bg-primary-500 border-primary-600'].map((i) => base + i)
            return ['border-design-border', 'bg-primary-500 border-primary-200'].map((i) => base + i)
        },
        base() {
            return ['rounded-full border-4 ', 'rounded-md border-2 ']
        }
    })
    return (
        <label class={classNames('select-none cursor-pointer', props.disabled && 'cursor-not-allowed opacity-50')}>
            <input
                class={props.class(inputClass()[isChecked() ? 1 : 0], 'appearance-none transition w-5 h-5 mr-2 translate-y-[3px]')}
                // @ts-ignore
                indeterminate={props.indeterminate}
                type={inputType()}
                checked={isChecked()}
                {...extendsBaseFormItemProp(props)}
                {...extendsEvent(props)}
                oninput={(e) => {
                    group?.toggleById?.(props.value.toString(), e.target.checked)
                    props.model(e.target.checked)
                }}
            />
            {props.label}
        </label>
    )
})

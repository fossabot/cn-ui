import { Atom, OriginComponent, atomization, classNames, computed, extendsEvent } from '@cn-ui/reactive'
import { createEffect, mergeProps } from 'solid-js'
import { JSXElement } from 'solid-js'
import { CountProps, useTextCount } from './useTextCount'
import { ensureFunctionResult } from '@cn-ui/reactive'
// Character count config
export interface CountConfig {
    max?: number // Max character count. Different from the native `maxLength`, it will be marked warning but not truncated
    strategy?: (value: string) => number // Custom character count, for example, the standard emoji length is greater than 1, you can customize the counting strategy to change it to 1
    show?: boolean | ((args: { value: string; count: number; maxLength?: number }) => JSXElement) // Same as `showCount`
    exceedFormatter?: (value: string, config: CountConfig) => string // Custom clipping logic when the number of characters exceeds `count.max`, no clipping when not configured
}

export interface InputExpose {
    inputType: Atom<string>
}

interface BaseInputProps extends Omit<CountProps, 'model'> {
    id?: string // The ID for input
    disabled?: boolean // Whether the input is disabled
    prefixIcon?: JSXElement | ((expose: InputExpose) => JSXElement) // The prefix icon for the Input
    suffixIcon?: JSXElement | ((expose: InputExpose) => JSXElement) // The suffix icon for the Input
    rounded?: boolean // Whether to round the corners of the input box
    type?: 'text' | 'textarea' | 'password' | string // The type of input, see: MDN (use Input.TextArea instead of type="textarea")
}
interface InputProps extends BaseInputProps {
    addonAfter?: JSXElement // The label text displayed after (on the right side of) the input field
    addonBefore?: JSXElement // The label text displayed before (on the left side of) the input field
    allowClear?: boolean | { clearIcon: JSXElement } // If allow to remove input content with clear icon

    status?: 'error' | 'warning' // Set validation status
    size?: 'large' | 'middle' | 'small' // The size of the input box. Note: in the context of a form, the middle size is used

    variant?: 'outlined' | 'borderless' | 'filled' // Variants of Input

    onChange?: (e: any) => void // Callback when user input
    onPressEnter?: (e: any) => void // The callback function that is triggered when Enter key is pressed
}

export const BaseInput = OriginComponent<BaseInputProps, HTMLInputElement, string>((props) => {
    props = mergeProps(props, {
        placeholder: '请输入文本',
        rounded: true
    })
    const inputType = atomization(props.type ?? 'text')
    const expose = { inputType }
    /** 域内前缀 */
    const Prefix = computed(() => {
        return <span class="mr-1">{ensureFunctionResult(props.prefixIcon, [expose])}</span>
    })
    const { TextCount, textLengthControl } = useTextCount(props)
    textLengthControl()
    /** 域内后缀 */
    const Suffix = computed(() => {
        return (
            <span class="ml-1">
                {ensureFunctionResult(props.suffixIcon, [expose])}
                {TextCount}
            </span>
        )
    })

    return (
        <span
            class={props.class(
                'transition inline-flex border py-1 px-3',
                props.rounded && 'rounded',
                props.disabled && 'bg-gray-100 text-gray-400',
                !props.disabled && 'hover:border-blue-400'
            )}
            style={props.style()}
        >
            {Prefix()}
            <input
                type={inputType()}
                disabled={props.disabled}
                class={classNames('bg-transparent appearance-none outline-none ', props.disabled && ' cursor-not-allowed')}
                {...props.$input()}
                {...extendsEvent(props)}
            ></input>
            {Suffix()}
        </span>
    )
})

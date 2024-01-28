import { Component } from 'solid-js'
import { InputExpose } from '.'
import { useMapper } from '@cn-ui/reactive'
import { AiFillEye, AiFillEyeInvisible, AiOutlineCloseCircle } from 'solid-icons/ai'
import { Icon } from '../../icon/Icon'

export const PasswordControl: Component<InputExpose> = (expose) => {
    const mapper = useMapper(
        // @ts-ignore
        expose.inputType,
        {
            password: <AiFillEye></AiFillEye>,
            text: <AiFillEyeInvisible></AiFillEyeInvisible>
        }
    )
    return (
        <Icon
            onclick={() => {
                expose.inputType((i) => {
                    return i === 'password' ? 'text' : 'password'
                })
            }}
        >
            {mapper()}
        </Icon>
    )
}
export const ClearControl: Component<InputExpose> = (expose) => {
    return (
        <Icon
            class="cn-clear-btn opacity-0 transition cursor-pointer"
            onclick={() => {
                expose.model('')
            }}
        >
            <AiOutlineCloseCircle color="#777" />
            <style>{`.cn-base-input:hover .cn-clear-btn { opacity: 1 !important; }`}</style>
        </Icon>
    )
}

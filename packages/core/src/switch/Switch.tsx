import { classNames, extendsEvent, OriginComponent } from '@cn-ui/reactive'
import './Switch.css'

export interface SwitchBtnProps {
    onSwitch?: (state: boolean, e: Event) => void
}
export const SwitchBtn = OriginComponent<SwitchBtnProps, HTMLInputElement, boolean>((props) => {
    return (
        <span
            class={props.class('cn-switch cursor-pointer')}
            style={props.style()}
            {...extendsEvent(props)}
            // @ts-ignore
            on:click={(e) => {
                props.model((i) => !i)
                props.onSwitch?.(props.model(), e)
            }}
        >
            <input type="checkbox" ref={props.ref} class="hidden" checked={props.model()} />
            <div
                class={classNames('slider inline-block relative transition-all h-6 w-12 rounded-full', props.model() ? 'bg-primary-400' : 'bg-gray-200')}
            ></div>
        </span>
    )
})

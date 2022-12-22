import { batch, createEffect, JSX, JSXElement, useContext } from 'solid-js';
import { Atom, atomization, extendsEvent } from '@cn-ui/use';
import { OriginComponent } from '@cn-ui/use';

interface LabelProps extends JSX.HTMLAttributes<HTMLLabelElement> {
    children?: JSXElement;
    for?: string;
}
export const DefaultLabel = OriginComponent<LabelProps, HTMLLabelElement>((props) => {
    return (
        <label
            {...props}
            class={props.class('cn-form-label inline-block text-slate-800')}
            style={props.style}
        >
            {props.children}
        </label>
    );
});
export interface CheckBoxProps extends Omit<FormField, 'onValueInput'> {
    children?: JSXElement;
    label: string;
    value: boolean | Atom<boolean>;
    disabled?: boolean | Atom<boolean>;
    indeterminate?: boolean | Atom<boolean>;
    /** 选中的字符 */
    checkedChar?: string;
    onValueInput?: (e, value: boolean) => void | Promise<boolean>;
}
import './style/checkbox.css';
import { emitEvent, useEventController } from '@cn-ui/use';
import { FormField } from '../interface';
import { CheckGroupContext } from './CheckGroup';
export const CheckBox = OriginComponent<CheckBoxProps, HTMLDivElement>((props) => {
    const { changeSelected, register, isSelected } = useContext(CheckGroupContext);

    const value = atomization(props.value ?? false);
    register(props.label, value());
    createEffect(() => {
        value(isSelected(props.label));
    });
    const disabled = atomization(props.disabled);
    const indeterminate = atomization(props.indeterminate);
    const control = useEventController({ disabled });
    return (
        <div
            ref={props.ref}
            class={props.class(
                'cn-form-check flex-none cursor-pointer select-none',
                disabled() && 'pointer-events-none cursor-not-allowed opacity-70'
            )}
            style={props.style}
            {...extendsEvent(props)}
            onClick={control(
                [
                    emitEvent(props.onValueInput, ([e]) => [e, !value()] as const),
                    async (e) => {
                        value((i) => !i);
                        changeSelected(props.label);
                    },
                ]
                // 使用 batch 会报错
                // { batch: false }
            )}
        >
            <span
                class="cn-check float-left mt-1 mr-2 h-4 w-4 appearance-none rounded-sm  border border-slate-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none "
                classList={{
                    indeterminate: indeterminate(),
                }}
                /** @ts-ignore */
                attr:checked={value()}
                checked-char={props.checkedChar ?? '√'}
            ></span>
            <input class="hidden" type="checkbox" checked={value()} disabled={disabled()}></input>
            <DefaultLabel>
                {props.label} {props.children}
            </DefaultLabel>
        </div>
    );
});
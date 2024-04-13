import { type JSXSlot, OriginComponent, ensureFunctionResult, extendsEvent } from "@cn-ui/reactive";
import { Match, Switch } from "solid-js";
import { GlobalButtonSlots } from "./ButtonSlots";
import { createDisabledClass } from "./style/createDisabledClass";
import { createTypeClass } from "./style/createTypeClass";
export interface ButtonProps extends ButtonSlots {
    /**
     * 按钮类型
     */
    type?: "primary" | "dashed" | "link" | "default" | "text";
    /**
     * 按钮的HTML类型
     */
    htmlType?: HTMLButtonElement["type"];

    /**
     * 按钮的形状
     */
    shape?: "default" | "circle" | "round";
    /**
     * 按钮是否禁用
     */
    disabled?: boolean;
    /**
     * 按钮是否加载中
     */
    loading?: boolean;
    /**
     * 按钮是否为透明按钮
     */
    ghost?: boolean;
    /**
     * 按钮是否为危险按钮
     */
    danger?: boolean;
    /**
     * 按钮是否为块级按钮
     */
    block?: boolean;
    /**
     * 按钮是否为圆形按钮
     */
    circle?: boolean;
}
export interface ButtonSlots {
    /**
     * 按钮的图标
     */
    icon?: JSXSlot;
    loadingIcon?: JSXSlot;
}

export const Button = OriginComponent<ButtonProps, HTMLButtonElement>((props) => {
    const typeClass = createTypeClass(props as ButtonProps);
    const disabledClass = createDisabledClass(props as ButtonProps);

    return (
        <button
            id={props.id}
            type={props.htmlType}
            class={props.class(
                "cn-button transition-colors ",
                props.loading && "pointer-events-none opacity-50",
                props.circle ? "rounded-full px-2 py-1" : "rounded-md  px-4 py-1 ",
                props.disabled ? disabledClass() : typeClass(),
            )}
            style={props.style()}
            {...extendsEvent(props)}
        >
            <Switch
                fallback={
                    <>
                        {ensureFunctionResult(props.icon)}
                        {props.children}
                    </>
                }
            >
                <Match when={props.loading}>
                    {GlobalButtonSlots.renderSlotAsDefault("loadingIcon", props.loadingIcon)}
                    {"加载中"}
                </Match>
            </Switch>
        </button>
    );
});

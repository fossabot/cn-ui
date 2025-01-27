import { type Atom, useMapper } from "@cn-ui/reactive";
import { AiFillEye, AiFillEyeInvisible, AiOutlineCloseCircle } from "solid-icons/ai";
import type { Component } from "solid-js";
import type { InputExpose } from ".";
import { Icon } from "../icon/Icon";

/** 密码 icon */
export const PasswordControl: Component<InputExpose> = (expose) => {
    const mapper = useMapper(
        // @ts-ignore
        expose.inputType,
        {
            password: <AiFillEye />,
            text: <AiFillEyeInvisible />,
        },
    );
    return (
        <Icon
            aria-label="更改密码显隐"
            clickable
            aria-disabled={expose.disabled()}
            onclick={() => {
                if (expose.disabled()) return;
                expose.inputType((i) => {
                    return i === "password" ? "text" : "password";
                });
            }}
        >
            {mapper()}
        </Icon>
    );
};
/** 清空 icon */
export const ClearControl: Component<{
    model?: Atom<string>;
    onClear?: () => void;
}> = (expose) => {
    return (
        <Icon
            clickable
            aria-label="清空按钮"
            class="cn-clear-btn opacity-0 transition cursor-pointer"
            onclick={() => {
                expose.model?.("");
                expose.onClear?.();
            }}
        >
            <AiOutlineCloseCircle color="#777" />
            <style>{".cn-base-input:hover .cn-clear-btn { opacity: 1 !important; }"}</style>
        </Icon>
    );
};

import { OriginComponent, extendsEvent, reflect } from "@cn-ui/reactive";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { common, createLowlight } from "lowlight";
import type { JSX } from "solid-js";
import { Fragment, jsx, jsxs } from "solid-js/h/jsx-runtime";

const lowlight = createLowlight(common);

export const Code = OriginComponent<
    {
        /** 代码作为 字符串写入 */
        code: string;
        lang?: string;
    },
    HTMLPreElement
>((props) => {
    const codes = reflect(
        () =>
            toJsxRuntime(lowlight.highlight(props.lang || "js", props.code), {
                Fragment,
                jsx,
                jsxs,
            } as any) as any as JSX.Element,
    );

    return (
        <pre
            class={props.class(`rounded-md p-4 hljs language-${props.lang}`)}
            style={props.style()}
            ref={props.ref}
            {...extendsEvent(props)}
        >
            <code class="whitespace-pre-wrap">{codes()}</code>
        </pre>
    );
});

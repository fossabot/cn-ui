import { lowlight } from 'lowlight';
import { toHtml } from 'hast-util-to-html';
import { extendsEvent, OriginComponent, reflect } from '@cn-ui/use';
export * from 'lowlight';
export const Code = OriginComponent<
    {
        /** 代码作为 字符串写入 */
        children: string;
        lang?: string;
    },
    HTMLPreElement
>((props) => {
    const codes = reflect(() => toHtml(lowlight.highlight(props.lang || 'js', props.children)));
    return (
        <pre
            class={props.class('hljs language-' + props.lang)}
            style={props.style}
            ref={props.ref}
            {...extendsEvent(props)}
        >
            <code class="whitespace-pre-wrap" innerHTML={codes()}></code>
        </pre>
    );
});

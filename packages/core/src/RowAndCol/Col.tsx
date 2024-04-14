import { OriginComponent, OriginDiv, spanToWidth, useBreakPointMapper } from "@cn-ui/reactive";
import { createMemo } from "solid-js";
import { RowCtx } from "./Row";
export interface ColSizeObject {
    /**
     * 24 栅格下占据的宽度
     * @tested
     */
    span?: number;
    /**
     * 该元素的向右偏移 span 值
     * @tested
     */
    offset?: number;
    /**
     * 栅格向左移动格数
     * @tested
     */
    pull?: number;
    /**
     * 栅格向右移动格数
     * @tested
     */
    push?: number;
}
export type ColSize = number | ColSizeObject;
export interface ColProps extends ColSizeObject {
    /**
     * 同 TailwindCSS xs: < 640
     * @tested
     */
    xs?: ColSize;
    /**
     * 同 TailwindCSS sm: >= 640
     * @tested
     */
    sm?: ColSize;
    /**
     * 同 TailwindCSS md: >= 768
     * @tested
     */
    md?: ColSize;
    /**
     * 同 TailwindCSS lg: >= 1024
     * @tested
     */
    lg?: ColSize;
    /**
     * 同 TailwindCSS xl: >= 1280
     * @tested
     */
    xl?: ColSize;
    /**
     * 同 TailwindCSS xs: >= 1536
     * @tested
     */
    xxl?: ColSize;
}

export const Col = OriginComponent<ColProps>((props) => {
    const responsiveSpan = useBreakPointMapper(props as unknown as ColProps);
    const responsiveSize = createMemo(() => {
        let size: ColSizeObject = {
            pull: props.pull,
            push: props.push,
            offset: props.offset,
            span: props.span ?? 24,
        };
        const res = responsiveSpan();
        if (res) {
            if (typeof res === "number") {
                size.span = res;
            } else {
                size = res;
            }
        }
        return size;
    });
    const RowContext = RowCtx.use();
    const ensureSize = (name: keyof ColSizeObject) => {
        return typeof responsiveSize()[name] === "number"
            ? spanToWidth(responsiveSize()[name]!)
            : undefined;
    };
    return (
        <OriginDiv
            prop={props}
            class={"relative"}
            style={{
                "padding-left": RowContext?.gutterX,
                "padding-right": RowContext?.gutterX,
                "padding-top": RowContext?.gutterY,
                "padding-bottom": RowContext?.gutterY,
                "max-width": spanToWidth(responsiveSize().span!),
                "margin-inline-start": ensureSize("offset"),
                "inset-inline-start": ensureSize("push"),
                "inset-inline-end": ensureSize("pull"),
                flex: `0 0 ${spanToWidth(responsiveSize().span!)}`,
            }}
        >
            {props.children}
        </OriginDiv>
    );
});

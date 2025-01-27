import { OriginComponent, OriginDiv, computed, createCtx } from "@cn-ui/reactive";
import { toCSSPx } from "@cn-ui/reactive";

export const RowJustify = [
    "start",
    "center",
    "end",
    "space-around",
    "space-between",
    "space-evenly",
] as const;

export const RowAlign = ["top", "middle", "bottom"] as const;

export type RowProps = {
    /**
     * 子单元之间的间距
     * @default 8px
     */
    gutter?: number | string | [number | string, number | string];
    /**
     * 水平对齐方式
     * @default start
     * @tested
     */
    justify?: (typeof RowJustify)[number];
    /**
     * 垂直对齐方式
     */
    align?: (typeof RowAlign)[number];
    /**
     * 每一行的底部 Margin
     * @default 20px
     * @tested
     */
    bottomSpace?: number | string;
};
export const RowCtx = /* @__PURE__ */ createCtx<{
    gutterX: string;
    gutterY: string;
}>(undefined, true);

export const Row = OriginComponent<RowProps>((props) => {
    const gutterX = computed(() => (Array.isArray(props.gutter) ? props.gutter[0] : props.gutter));
    const gutterY = computed(() => (Array.isArray(props.gutter) ? props.gutter[1] : props.gutter));
    return (
        <RowCtx.Provider
            value={{
                gutterX: toCSSPx(gutterX(), "8px"),
                gutterY: toCSSPx(gutterY(), "8px"),
            }}
        >
            <OriginDiv
                prop={props}
                class="flex flex-row flex-wrap"
                style={{
                    // 为了兼容性和与其他框架实现一致，采用子 padding 的模式
                    "justify-content": props.justify ?? "start",
                    "align-items": props.align,
                    "margin-bottom": toCSSPx(props.bottomSpace, "20px"),
                }}
            >
                {props.children}
            </OriginDiv>
        </RowCtx.Provider>
    );
});

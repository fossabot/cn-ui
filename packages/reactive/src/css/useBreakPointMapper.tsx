import { reflect } from "@cn-ui/reactive";
import { breakpointsTailwind, useBreakpoints } from "solidjs-use";

/**
 * 联通 Tailwind 的响应式标识符号
 * @example
 * const BreakPointAtom = useBreakPointMapper(props) // when xs, it will get props.xs
 */
export function useBreakPointMapper<T>(
    record: Partial<Record<"xs" | "sm" | "md" | "lg" | "xl" | "xxl", T>>,
) {
    const bk = useBreakpoints(breakpointsTailwind);
    const xs = bk.smaller("sm");
    const sm = bk.greaterOrEqual("sm");
    const md = bk.greaterOrEqual("md");
    const lg = bk.greaterOrEqual("lg");
    const xl = bk.greaterOrEqual("xl");
    const xxl = bk.greaterOrEqual("2xl");
    return reflect(() => {
        if (xxl()) return record.xxl;
        if (xl()) return record.xl;
        if (lg()) return record.lg;
        if (md()) return record.md;
        if (sm()) return record.sm;
        if (xs()) return record.xs;
    });
}

import Arrow from "@popperjs/core/lib/modifiers/arrow";
import computeStyles from "@popperjs/core/lib/modifiers/computeStyles";
import flip from "@popperjs/core/lib/modifiers/flip";
import Offset from "@popperjs/core/lib/modifiers/offset";
import preventOverflow from "@popperjs/core/lib/modifiers/preventOverflow";
import { defaultModifiers, popperGenerator } from "@popperjs/core/lib/popper-lite";

/** 重新配置全局的 Popper 生成器 */
export const createPopper = popperGenerator({
    defaultModifiers: [
        ...defaultModifiers,
        flip,
        preventOverflow,
        Arrow,
        Offset,
        computeStyles,
        {
            name: "sameWidth",
            enabled: false,
            phase: "beforeWrite",
            requires: ["computeStyles"],
            fn: ({ state }) => {
                state.styles.popper.width = `${state.rects.reference.width}px`;
            },
            effect: ({ state }) => {
                state.elements.popper.style.width = `${
                    (state.elements.reference as any).offsetWidth
                }px`;
            },
        },
    ],
});

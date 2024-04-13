import {
    type Accessor,
    type JSXElement,
    type ResolvedJSXElement,
    children,
    createMemo,
} from "solid-js";
import type { ComputedAtom } from "../atom";

export const ensureChildren = (kids: Accessor<JSXElement>, limit = 1) => {
    return createMemo(() => {
        const arr = children(kids).toArray();
        if (arr.length > limit) {
            throw new Error("solid ensureChild | children is more than " + limit);
        }
        return arr;
    });
};
export const ensureOnlyChild = (kids: Accessor<JSXElement>, throwError = true) => {
    return createMemo(() => {
        const arr = children(kids).toArray();
        if (arr.length > 1 && throwError) {
            throw new Error("solid ensureChild | children is more than 1 ");
        }
        return arr[0];
    });
};
export const splitOneChild = (kids: Accessor<JSXElement>) => {
    const arr = children(kids).toArray();
    return [
        createMemo(() => {
            return arr[0];
        }),
        createMemo(() => arr.slice(1)),
    ] as [ComputedAtom<ResolvedJSXElement>, ComputedAtom<ResolvedJSXElement[]>];
};

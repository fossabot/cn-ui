import type { Atom } from "./index";

/**
 * 简单更新 map 的方法
 * @example updateMapAtom(mapAtom, (i) => i.set('a', 'b'))
 */
export const updateMapAtom = <T, D>(a: Atom<Map<T, D>>, fn: (i: Map<T, D>) => void) => {
    a((i) => {
        const newMap = new Map(i);
        fn(newMap);
        return newMap;
    });
};

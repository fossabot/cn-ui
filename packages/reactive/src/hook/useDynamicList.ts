import type { Atom } from "../atom";

export type DynamicListReturn<T> = ReturnType<typeof useDynamicList<T>>;
export const useDynamicList = <T>(list: Atom<T[]>) => {
    const updateList = (fn: (i: T[]) => void) => {
        list((i) => {
            const newList = [...i];
            fn(newList);
            return newList;
        });
    };
    return {
        list,
        insert: (index: number, item: T) => {
            updateList((list) => list.splice(index, 0, item));
        },
        merge: (index: number, items: T[]) => {
            updateList((list) => list.splice(index, 0, ...items));
        },
        replace: (index: number, item: T) => {
            updateList((list) => {
                list[index] = item;
            });
        },
        remove: (index: number) => {
            updateList((i) => i.splice(index, 1));
        },
        updateList,
    };
};

import type { SignalOptions } from 'solid-js';
import { Atom, AtomTypeSymbol, atom } from './atom';
import type { InferArray } from 'src/typeUtils';

export interface ArrayAtomExtends<T> {
    replace(oldItem: T, newItem: T): this;
    replaceAll(oldItem: T, newItem: T): this;
    remove(item: T): this;
    removeAll(item: T): this;
    insertBefore(positionItem: T, newItem: T): this;
    insertAfter(positionItem: T, newItem: T): this;
}
export interface ArrayAtomType<Arr extends any[]>
    extends Atom<Arr>,
        ArrayAtomExtends<InferArray<Arr>> {}

/**
 * @zh 更加简单操作数组 Atom 对象
 */
export const ArrayAtom = <Arr extends any[], T = InferArray<Arr>>(
    init: Arr,
    options?: SignalOptions<Arr>
): ArrayAtomType<Arr> => {
    const arr = atom(init, options);
    /** 指向第一个匹配到的对象 */
    const cursorItem = <Inner>(
        i: Inner[],
        oldItem: Inner,
        func: (arr: Inner[], index: number) => void
    ) => {
        const index = i.findIndex((ii) => ii === oldItem);
        if (index >= 0) {
            const newArr = [...i];
            func(newArr, index);
            return newArr;
        } else {
            console.warn("Can't find array atom Item: ", oldItem);
            return i;
        }
    };
    const arrM: ArrayAtomExtends<T> = {
        /** 替换一个数组位置 */
        replace(oldItem, newItem) {
            arr((i) => {
                return cursorItem<T>(i, oldItem, (arr, index) => {
                    arr[index] = newItem;
                }) as Arr;
            });
            return this;
        },
        /** 替换所有的数组位置 */
        replaceAll(oldItem, newItem) {
            arr((i) => {
                const indexArray: number[] = [];
                i.forEach((ii, index) => ii === oldItem && indexArray.push(index));
                const newArr = [...i];
                indexArray.forEach((index) => (newArr[index] = newItem));
                return newArr as Arr;
            });
            return this;
        },
        /** 根据该元素删除数组中的所有这个元素 */
        remove(item) {
            arr((i) => {
                return cursorItem<T>(i, item, (arr, index) => {
                    arr.splice(index, 1);
                }) as Arr;
            });
            return this;
        },
        removeAll(item) {
            arr((i) => {
                return i.filter((ii) => ii !== item) as Arr;
            });
            return this;
        },
        insertBefore(positionItem, newItem) {
            arr((i) => {
                return cursorItem<T>(i, positionItem, (arr, index) => {
                    arr.splice(index, 0, newItem);
                }) as Arr;
            });
            return this;
        },
        insertAfter(positionItem, newItem) {
            arr((i) => {
                return cursorItem<T>(i, positionItem, (arr, index) => {
                    arr.splice(index + 1, 0, newItem);
                }) as Arr;
            });
            return this;
        },
    };
    /** @ts-ignore */
    return Object.assign(arr, { ...arrM, [AtomTypeSymbol]: 'array' });
};
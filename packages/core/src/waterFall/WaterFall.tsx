import {
    type Atom,
    OriginComponent,
    type OriginComponentInputType,
    atomization,
    classNames,
    extendsEvent,
    reflect,
} from "@cn-ui/reactive";
import { type Accessor, For, type JSXElement, createMemo } from "solid-js";
export interface WaterFallProps<T> {
    /**
     * an array to get data from
     * @zh 数据源
     */
    each: T[] | Atom<T[]>;
    column?: number | Atom<number>;
    children: (data: T, index?: Accessor<number>) => JSXElement;
    // 控制列的 class
    colClass?: string;
    fallback?: () => JSXElement;
}

/**
 * 瀑布流布局组件库
 */
export const WaterFall = OriginComponent(function <T>(
    props: OriginComponentInputType<WaterFallProps<T>>,
) {
    const items = atomization(props.each);
    const column = atomization(props.column ?? 3);
    const columnItems = reflect(() => {
        return items().reduce(
            (col, item, index) => {
                col[index % column()].push(item);
                return col;
            },
            [...Array(column()).keys()].map(() => [] as T[]),
        );
    });

    return (
        <section class={props.class("flex")} style={props.style()} {...extendsEvent(props)}>
            <For each={columnItems()} fallback={props.fallback?.()}>
                {(items, colIndex) => {
                    return (
                        <div class={classNames("flex flex-1 flex-col ", props.colClass)}>
                            <For each={items}>
                                {(item, rowIndex) =>
                                    props.children(
                                        item,
                                        createMemo(() => rowIndex() * column() + colIndex()),
                                    )
                                }
                            </For>
                        </div>
                    );
                }}
            </For>
        </section>
    );
});

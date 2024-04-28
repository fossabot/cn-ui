import { type Atom, atom, classNames, createCtx, toCSSPx } from "@cn-ui/reactive";
import { createMemo, onMount } from "solid-js";
import { MagicTableCtx, MagicVirtualTableCtx } from "../MagicTableCtx";
import { checkEllipsis } from "../hook/useCheckEllipsis";
import { type Cell, type CellContext, flexRender } from "../solidTable";
import type { VirtualItem } from "../virtual";
import { getCommonPinningStyles } from "./getCommonPinningStyles";
export const MagicTableCellCtx = /* @__PURE__ */ createCtx<{
    contain: Atom<HTMLElement | null>;
}>();

export interface BodyCellProps<T, D> {
    position?: "left" | "right";
    absolute: boolean;
    cell: Cell<T, D>;
    item: VirtualItem;
    paddingLeft?: number;
}
export function BodyCell<T, D>(props: BodyCellProps<T, D>) {
    const vTable = MagicVirtualTableCtx.use();
    const { estimateHeight, defaultCell: defaultCellTemplate } = MagicTableCtx.use();

    const ctx = createMemo(() => props.cell.getContext());
    /** 默认的 cell */
    const defaultCell = createMemo(() => ctx().table._getDefaultColumnDef().cell);
    /** 用户自定义的 cell */
    const cell = createMemo(() => props.cell.column.columnDef.cell);
    const contain = atom<HTMLElement | null>(null);
    return (
        <MagicTableCellCtx.Provider value={{ contain }}>
            <td
                class={classNames(
                    props.absolute !== false && "absolute",
                    props.cell.column.getIsPinned() && "sticky",
                    "cn-table-body-cell block transition-colors border-b border-r",
                )}
                data-index={props.item.index}
                ref={(el) => {
                    contain(el);
                    if (props.absolute && !props.position)
                        queueMicrotask(() => vTable.columnVirtualizer.measureElement(el));
                }}
                style={{
                    width: toCSSPx(props.cell.column.getSize()),
                    height: toCSSPx(estimateHeight(), "48px"),
                    left: toCSSPx(props.item.start + (props.paddingLeft ?? 0)),
                    ...getCommonPinningStyles(props.cell.column, props.paddingLeft ?? 0),
                }}
            >
                {flexRender(
                    cell() === defaultCell() ? defaultCellTemplate ?? defaultBodyCell : cell(),
                    ctx(),
                )}
            </td>
        </MagicTableCellCtx.Provider>
    );
}

export function defaultBodyCell<T>(ctx: CellContext<T, string>) {
    const cellCtx = MagicTableCellCtx.use();
    const cell = atom<HTMLElement | null>(null);
    const isEllipsis = atom(false);
    onMount(() => {
        isEllipsis(() => checkEllipsis(cell()!, cellCtx.contain()!));
    });
    return (
        // TODO: ellipsis
        <div
            class="w-full h-full flex-1 p-2 overflow-hidden text-ellipsis text-nowrap"
            ref={cell}
            title={isEllipsis() ? ctx.getValue() : undefined}
        >
            {ctx.getValue()}
        </div>
    );
}

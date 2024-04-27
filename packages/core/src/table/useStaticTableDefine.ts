import { atom } from "@cn-ui/reactive";
import { createMemo } from "solid-js";
import { expandingConfig, indexConfig, selectionConfig } from "./defaultConfig";
import type { MagicTableProps } from "./interface";
import {
    type ColumnDef,
    type ColumnOrderState,
    type ColumnSizingState,
    type ExpandedState,
    type OnChangeFn,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    createSolidTable,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
} from "./solidTable";
import { useSticky } from "./useSticky";

export const useStaticTableDefine = <T>(props: MagicTableProps<T>) => {
    const [rowSelection, onRowSelectionChange] = createStateLinker<RowSelectionState>({});
    const [sorting, onSortingChange] = createStateLinker<SortingState>([]);
    const [columnVisibility, onColumnVisibilityChange] = createStateLinker<VisibilityState>({});
    const [columnSizing, onColumnSizingChange] = createStateLinker<ColumnSizingState>({});
    const [expanded, onExpandedChange] = createStateLinker<ExpandedState>({});
    const [columnOrder, onColumnOrderChange] = createStateLinker<ColumnOrderState>([]);
    const composedColumns = createMemo<ColumnDef<T>[]>(() =>
        /** @ts-ignore */
        [
            props.selection && selectionConfig,
            props.index && indexConfig,
            props.expandable && expandingConfig,
            ...props.columns,
        ].filter((i) => i),
    );

    const table = createSolidTable<T>({
        get data() {
            return props.data;
        },
        get columns() {
            return composedColumns();
        },
        state: {
            get columnSizing() {
                return columnSizing();
            },
            get rowSelection() {
                return rowSelection();
            },
            get sorting() {
                return sorting();
            },
            get columnVisibility() {
                return columnVisibility();
            },
            get columnOrder() {
                return columnOrder();
            },
            get expanded() {
                return expanded();
            },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),

        onColumnSizingChange,
        columnResizeMode: "onEnd",
        columnResizeDirection: "ltr",

        onExpandedChange,
        getSubRows: (row, index) => props.getSubRows?.(row, index) ?? (row as any).subRows,
        onColumnVisibilityChange,
        onColumnOrderChange,
        enableExpanding: !!props.expandable,
        enableRowSelection: !!props.selection,
        onRowSelectionChange,
        onSortingChange,
        meta: {
            updateData: props.onUpdateData,
        },
        debugTable: true,
    });

    return {
        table,
        composedColumns,
        rowSelection,
        sorting,
        columnVisibility,
        columnSizing,
        expanded,
        columnOrder,
        ...useSticky(table),
    };
};
/** 构建 tanstack 和 solidjs 变量的转换函数 */
function createStateLinker<T>(init: T) {
    const state = atom(init);
    return [
        state,
        ((updateOrValue) => {
            state((selection) =>
                typeof updateOrValue === "function"
                    ? (updateOrValue as (a: T) => T)(selection)
                    : updateOrValue,
            );
        }) as OnChangeFn<T>,
    ] as const;
}

import { Atom, createCtx } from '@cn-ui/reactive'
import { CellContext, RowSelectionState, Table } from '@tanstack/solid-table'
import { useVirtual } from './useVirtual'
import { useScroll } from 'solidjs-use'
import { Accessor } from 'solid-js'
import { MagicTableProps } from './interface'
import { JSX } from 'solid-js'
import { useSticky } from './useSticky'

export interface MagicTableCtxType<T = unknown> extends ReturnType<typeof useSticky> {
    tableProps: MagicTableProps<T>
    table: Table<T>
    rowSelection: Atom<RowSelectionState>
    tableScroll: ReturnType<typeof useScroll>
    selection: Accessor<MagicTableProps<T>['selection']>
    estimateHeight: Accessor<number | undefined>
    width: Accessor<number>
    defaultCell?: <T, D>(props: CellContext<T, D>) => JSX.Element
}

export const MagicTableCtx = /* @__PURE__ */ createCtx<MagicTableCtxType>()

export const MagicVirtualTableCtx = /* @__PURE__ */ createCtx<ReturnType<typeof useVirtual<unknown>>>(undefined, true)

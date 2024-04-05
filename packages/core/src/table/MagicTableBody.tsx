import { toCSSPx } from '@cn-ui/reactive'
import { MagicTableCtx, MagicTableCtxType, MagicVirtualTableCtx } from './MagicTableCtx'
import { BodyRow } from './slot/BodyRow'
import { Key } from '@solid-primitives/keyed'
import { createMemo } from 'solid-js'
import { VirtualItem } from '@tanstack/solid-virtual'
import { Row } from '@tanstack/solid-table'
export function MagicTableBody<T>(props: { rowAbsolute: boolean }) {
    const { rowVirtualizer, tableWidth } = MagicVirtualTableCtx.use()
    const { table } = MagicTableCtx.use<MagicTableCtxType<T>>()
    const renderingRows = createMemo<(VirtualItem | Row<unknown>)[]>(() => (props.rowAbsolute ? rowVirtualizer.getVirtualItems() : table.getCenterRows()))
    return (
        <tbody
            class="block relative border-x border-gray-200"
            style={
                props.rowAbsolute
                    ? {
                          height: `${rowVirtualizer.getTotalSize()}px`,
                          width: toCSSPx(props.rowAbsolute ? tableWidth() : 'fit-content')
                      }
                    : undefined
            }
        >
            <Key by={(i) => (i as any).key ?? i.index} each={renderingRows()}>
                {(virtualRow) => {
                    return <BodyRow absolute={props.rowAbsolute} bindScroll={props.rowAbsolute} virtualRow={virtualRow()}></BodyRow>
                }}
            </Key>
        </tbody>
    )
}

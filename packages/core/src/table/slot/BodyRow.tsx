import { JSXElement, Show, createMemo } from 'solid-js'
import { MagicTableCtx, MagicTableCtxType, MagicVirtualTableCtx } from '../MagicTableCtx'
import { BodyCell } from './BodyCell'
import { classNames, toCSSPx } from '@cn-ui/reactive'
import { Cell, Column, Row } from '@tanstack/solid-table'
import { VirtualItem } from '../virtual'
import { Key } from '@solid-primitives/keyed'
import './bodyRow.css'
export function BodyRow<T, _D>(props: {
    index?: string | number
    bindScroll?: boolean
    cells?: Cell<T, unknown>[]
    columnsFilter?: (items: VirtualItem[]) => VirtualItem[]
    children?: (item: VirtualItem) => JSXElement
    virtualRow: VirtualItem | Row<unknown>
    hideWhenEmpty?: boolean
    absolute: boolean
}) {
    const vTable = MagicVirtualTableCtx.use()
    const { width, estimateHeight, paddingRight } = MagicTableCtx.use<MagicTableCtxType<T>>()

    const row = createMemo(() => {
        if (props.absolute) {
            return vTable.rows()[props.virtualRow.index]
        } else {
            return props.virtualRow as Row<unknown>
        }
    })

    const visibleCells = createMemo(() => props.cells ?? row()?.getCenterVisibleCells() ?? [])

    const columns = createMemo<(VirtualItem | Column<T, unknown>)[]>(() => {
        if (props.columnsFilter) return props.columnsFilter(vTable.columnVirtualizer.getVirtualItems())
        return vTable.columnVirtualizer.getVirtualItems()
    })
    const rightSideLeft = createMemo(() => {
        return width() - paddingRight()
    })
    return (
        <Show when={(!props.hideWhenEmpty || columns().length) && row()}>
            <tr
                data-index={props.virtualRow.index} //needed for dynamic row height measurement
                ref={(node) => {
                    if (props.bindScroll !== false && props.absolute) queueMicrotask(() => vTable.rowVirtualizer.measureElement(node))
                }} //measure dynamic row height
                class={classNames(
                    props.absolute && 'absolute',
                    'cn-table-body-row  flex w-full duration-300 transition-colors border-b',
                    row().getIsSelected() && 'cn-selected'
                )}
                style={
                    props.absolute
                        ? {
                              top: toCSSPx((props.virtualRow as VirtualItem).start),
                              height: toCSSPx(estimateHeight(), '48px')
                          }
                        : undefined
                }
                // rowClick Selection
                // onClick={() => {
                //     selection() && row().toggleSelected()
                // }}
            >
                <Key by="id" each={row().getLeftVisibleCells()}>
                    {(cell, index) => {
                        return (
                            <Show when={cell()}>
                                <BodyCell
                                    position="left"
                                    absolute={props.absolute}
                                    cell={cell()}
                                    item={{ index: index(), start: cell().column.getStart() } as any}
                                ></BodyCell>
                            </Show>
                        )
                    }}
                </Key>
                {props.absolute ? (
                    <Key by="key" each={columns() as VirtualItem[]}>
                        {(item) => {
                            const cell = createMemo(() => visibleCells()[item().index])
                            return (
                                <Show when={cell()}>
                                    <BodyCell absolute={props.absolute} cell={cell() as Cell<T, unknown>} item={item()}></BodyCell>
                                </Show>
                            )
                        }}
                    </Key>
                ) : (
                    <Key by="id" each={row().getCenterVisibleCells()}>
                        {(cell, index) => {
                            return (
                                <Show when={cell()}>
                                    <BodyCell
                                        absolute={props.absolute}
                                        cell={cell()}
                                        item={{ index: index(), start: cell().column.getStart() } as any}
                                    ></BodyCell>
                                </Show>
                            )
                        }}
                    </Key>
                )}
                <Key by="id" each={row().getRightVisibleCells()}>
                    {(cell, index) => {
                        return (
                            <Show when={cell()}>
                                <BodyCell
                                    position="right"
                                    paddingLeft={rightSideLeft()}
                                    absolute={props.absolute}
                                    cell={cell()}
                                    item={{ index: index(), start: cell().column.getStart() } as any}
                                ></BodyCell>
                            </Show>
                        )
                    }}
                </Key>
            </tr>
        </Show>
    )
}

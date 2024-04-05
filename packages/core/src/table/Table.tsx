import { atom, classNames, toCSSPx } from '@cn-ui/reactive'
import { MagicTableCtx, MagicTableCtxType, MagicVirtualTableCtx } from './MagicTableCtx'
import { useVirtual } from './useVirtual'
import { MagicTableHeader } from './MagicTableHeader'
import { MagicTableBody } from './MagicTableBody'
import { useScroll } from 'solidjs-use'
import { useAutoResize } from './hook/useAutoResize'
import { MagicTableProps, MagicTableExpose } from './interface'
import { useStaticTableDefine } from './useStaticTableDefine'
import { createMemo } from 'solid-js'

export function MagicTable<T>(props: MagicTableProps<T>) {
    const tableContainerRef = atom<HTMLDivElement | null>(null)

    // 静态 table 的各项属性
    const { table, rowSelection, composedColumns } = useStaticTableDefine(props)
    // 虚拟 table 的各项属性
    const virtualSettings = useVirtual<T>(table, tableContainerRef, { composedColumns, estimateHeight: () => props.estimateHeight })

    const { height, width } = useAutoResize(tableContainerRef)
    const tableScroll = useScroll(() => (props.virtual ? tableContainerRef() : tableContainerRef()?.parentElement))

    const context = createMemo<MagicTableCtxType<T>>(() => ({
        tableProps: props,
        rowSelection,
        table,
        width,
        defaultCell: props.defaultCell,
        tableScroll,
        selection: () => props.selection,
        estimateHeight: () => props.estimateHeight
    }))
    const expose: MagicTableExpose<T> = {
        ...context(),
        clearSelection() {
            table.resetRowSelection()
        },
        getSelectionRows() {
            return table.getFilteredSelectedRowModel().rows.map((i) => i.original)
        },
        toggleAllSelection(selected) {
            table.toggleAllRowsSelected(selected)
        },
        toggleRowSelection(row, selected) {
            table.setRowSelection((selectedObj) => {
                selectedObj[row.toString()] = selected ?? !selectedObj[row.toString()]
                return selectedObj
            })
        }
    }
    props.expose?.(expose)
    return (
        <MagicTableCtx.Provider value={context() as unknown as MagicTableCtxType}>
            <MagicVirtualTableCtx.Provider value={virtualSettings}>
                <table
                    class={classNames(props.virtual && 'block ', 'relative overflow-auto border border-gray-200')}
                    style={
                        props.virtual
                            ? {
                                  width: toCSSPx(Math.min(width(), virtualSettings.tableWidth() + 5), '400px'),
                                  height: toCSSPx(props.height ?? height(), '400px')
                              }
                            : undefined
                    }
                    ref={tableContainerRef}
                >
                    <MagicTableHeader rowAbsolute={!!props.virtual}></MagicTableHeader>
                    <MagicTableBody rowAbsolute={!!props.virtual}></MagicTableBody>
                </table>
            </MagicVirtualTableCtx.Provider>
        </MagicTableCtx.Provider>
    )
}

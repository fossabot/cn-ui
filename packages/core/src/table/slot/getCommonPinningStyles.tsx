import { toCSSPx } from '@cn-ui/reactive'
import { Column } from '@tanstack/solid-table'
import { JSX } from 'solid-js'
import { MagicTableCtx, MagicTableCtxType } from '../MagicTableCtx'

export function getCommonPinningStyles<T, D>(column: Column<T, D>, paddingLeft: number): JSX.CSSProperties {
    const isPinned = column.getIsPinned()
    if (!isPinned) return {}
    const { tableScroll } = MagicTableCtx.use<MagicTableCtxType<T>>()
    let isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
    let isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

    // 判断滚动条是否在起点位置
    if (tableScroll.arrivedState.left) isLastLeftPinnedColumn = false
    if (tableScroll.arrivedState.right) isFirstRightPinnedColumn = false
    return {
        'box-shadow': isLastLeftPinnedColumn ? '#00000033 4px 0px 4px 0px ' : isFirstRightPinnedColumn ? '#00000033 -4px 0px 4px 0px ' : undefined,
        left: isPinned ? toCSSPx((isPinned === 'left' ? 0 : paddingLeft) + column.getStart(isPinned)) : undefined,
        'z-index': isPinned ? 1 : 0,
        position: 'sticky'
    }
}

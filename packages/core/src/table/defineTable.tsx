import { SelectOptionsType } from '@cn-ui/reactive'
import { RuleItem } from 'async-validator'

declare module '@tanstack/solid-table' {
    interface TableMeta<TData extends unknown> {
        updateData?: (rowIndex: number, columnId: string, value: any) => void
    }
    interface ColumnDefBase<TData extends unknown, TValue = unknown> {
        /** 可编辑表格使用的类型 */
        type?: 'text' | 'number' | 'date' | 'date-range' | 'select' | 'checkbox' | 'switch' | 'radio' | 'cascader' | 'switch'
        fixed?: 'left' | 'right'
        options?: SelectOptionsType[]
        span?: number
        rules?: RuleItem[] | RuleItem
        required?: boolean
    }
}

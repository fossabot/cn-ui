import type { Meta, StoryObj } from 'storybook-solidjs'
import { MagicTable, MagicTableExpose } from './index'
import { random } from 'lodash-es'
import { NullAtom, atom } from '@cn-ui/reactive'
import { onMount } from 'solid-js'

const meta = {
    title: 'Data 数据展示/Table 表格组件',
    component: MagicTable,
    argTypes: {}
} satisfies Meta<typeof MagicTable>

export default meta
type Story = StoryObj<typeof meta>

const makeColumns = (num: number) =>
    [...Array(num)].map((_, i) => {
        return {
            accessorKey: i.toString(),
            header: 'Col ' + i.toString(),
            size: random(10, 100),
            minSize: 50, //enforced during column resizing
            maxSize: 500 //enforced during column resizing
        }
    })

const makeData = (num: number, columns: { accessorKey: string }[]): Record<string, string>[] =>
    [...Array(num).keys()].map((y) => ({
        ...Object.fromEntries(columns.map((col, x) => [col.accessorKey, [x, y].join('-')]))
    }))
export const Primary: Story = {
    name: '1000x1000',
    render() {
        console.time('createData')
        const cols = makeColumns(1000)
        const data = makeData(1000, cols)
        console.timeEnd('createData')
        return (
            <>
                <MagicTable columns={cols} data={data}></MagicTable>
                <style>
                    {`html,body,#storybook-root {
                height:100%
            }`}
                </style>
            </>
        )
    },
    args: {}
}
export const Selection: Story = {
    name: 'Selection and Index',
    render() {
        console.time('createData')
        const cols = makeColumns(100)
        const data = makeData(100, cols)
        console.timeEnd('createData')
        const expose = NullAtom<MagicTableExpose<Record<string, string>>>(null)
        onMount(() => {})
        return (
            <>
                <MagicTable selection index columns={cols} data={data} expose={expose}></MagicTable>
                <style>
                    {`html,body,#storybook-root {
                height:100%
            }`}
                </style>
            </>
        )
    },
    args: {}
}

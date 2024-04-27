import { NullAtom, genArray } from "@cn-ui/reactive";
import type { ColumnDef } from "@tanstack/solid-table";
import { random } from "mockjs-ts";
import type { Meta, StoryObj } from "storybook-solidjs";
import { ColumnGroups } from "./example/ColumnGroups";
import { ColumnOrdering } from "./example/ColumnOrdering";
import { Expanded } from "./example/Expanded";
import { ColumnPinned } from "./example/ColumnPinned";
import { FormTable } from "./example/FormTable";
import { PaginationExample } from "./example/Pagination";
import { MagicTable, type MagicTableExpose, useTableVirtual } from "./index";
import { makeVirtualColumns, makeVirtualData } from "./example/DataMaker";
import { DefaultSelection } from "./example/DefaultSelection";
const meta = {
    title: "Data 数据展示/Table 表格组件",
    component: MagicTable,
    argTypes: {},
} satisfies Meta<typeof MagicTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    name: "1000x1000",
    decorators: [
        (Story) => (
            <>
                <div class="p-12 overflow-hidden h-full">
                    <div class="overflow-auto h-full">
                        <Story />
                    </div>
                </div>
                <style>
                    {`html,body,#storybook-root {
                height:100%
            }`}
                </style>
            </>
        ),
    ],
    render() {
        console.time("createData");
        const cols = makeVirtualColumns(1000);
        const data = makeVirtualData(
            1000,
            genArray(1000).map((i) => i.toString()),
        );
        console.timeEnd("createData");
        return <MagicTable virtual={useTableVirtual} columns={cols} data={data} />;
    },
    args: {},
};
export const Selection: Story = {
    name: "Selection and Index",
    decorators: Primary.decorators,
    render: DefaultSelection,
    args: {},
};
export const Expanding: Story = {
    name: "Expanding 展开行",
    decorators: Primary.decorators,
    render: Expanded,
    args: {},
};
export const ColumnPinned_: Story = {
    name: "ColumnPinned 固定列",
    decorators: Primary.decorators,
    render: ColumnPinned,
    args: {},
};

export const ColumnGroup: Story = {
    name: "ColumnGroup 多级表头",
    decorators: Primary.decorators,
    render: ColumnGroups,
    args: {},
};
export const _ColumnOrdering: Story = {
    name: "ColumnOrdering 列排序",
    decorators: Primary.decorators,
    render: ColumnOrdering,
    args: {},
};
export const _Pagination: Story = {
    name: "Pagination 分页",
    decorators: Primary.decorators,
    render: PaginationExample,
    args: {},
};
export const _Form: Story = {
    name: "Form 可编辑表格",
    decorators: Primary.decorators,
    render: FormTable,
    args: {},
};

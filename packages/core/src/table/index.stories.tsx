import { NullAtom } from "@cn-ui/reactive";
import type { ColumnDef } from "@tanstack/solid-table";
import { random } from "mockjs-ts";
import type { Meta, StoryObj } from "storybook-solidjs";
import { ColumnGroups } from "./example/ColumnGroups";
import { ColumnOrdering } from "./example/ColumnOrdering";
import { Expanded } from "./example/Expanded";
import { FormTable } from "./example/FormTable";
import { PaginationExample } from "./example/Pagination";
import { MagicTable, type MagicTableExpose, useTableVirtual } from "./index";

const meta = {
    title: "Data 数据展示/Table 表格组件",
    component: MagicTable,
    argTypes: {},
} satisfies Meta<typeof MagicTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeColumns = (num: number) =>
    [...Array(num)].map((_, i) => {
        return {
            accessorKey: i.toString(),
            header: `Col ${i.toString()}`,
            size: random(10, 100),
            minSize: 200, //enforced during column resizing
            maxSize: 500, //enforced during column resizing
        };
    }) as ColumnDef<Record<string, string>>[];

const makeData = (num: number, columns: any[]): Record<string, string>[] =>
    [...Array(num).keys()].map((y) => ({
        ...Object.fromEntries(columns.map((col, x) => [col.accessorKey, [x, y].join("-")])),
    }));
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
        const cols = makeColumns(1000);
        const data = makeData(1000, cols);
        console.timeEnd("createData");
        return <MagicTable virtual={useTableVirtual} columns={cols} data={data} />;
    },
    args: {},
};
export const Selection: Story = {
    name: "Selection and Index",
    decorators: Primary.decorators,
    render() {
        console.time("createData");
        const cols = makeColumns(100);
        const data = makeData(100, cols);
        console.timeEnd("createData");
        const expose = NullAtom<MagicTableExpose<Record<string, string>>>(null);
        return (
            <MagicTable
                virtual={useTableVirtual}
                selection
                index
                columns={cols}
                data={data}
                expose={expose}
            />
        );
    },
    args: {},
};
export const Expanding: Story = {
    name: "Expanding 展开行",
    decorators: Primary.decorators,
    render: Expanded,
    args: {},
};
export const ColumnPinned: Story = {
    name: "ColumnPinned 固定列",
    decorators: Primary.decorators,
    render() {
        console.time("createData");
        const cols = makeColumns(100);
        const data = makeData(100, cols);
        cols.slice(0, 5).forEach((i, index) => {
            i.fixed = index % 2 ? "left" : "right";
        });
        console.log(data);
        console.timeEnd("createData");
        const expose = NullAtom<MagicTableExpose<Record<string, string>>>(null);
        return <MagicTable columns={cols} data={data} expose={expose} />;
    },
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

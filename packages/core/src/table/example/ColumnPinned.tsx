import { NullAtom } from "@cn-ui/reactive";
import { type ColumnDef, MagicTable, type MagicTableExpose } from "..";
import { random } from "mockjs-ts";

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
export const ColumnPinned = () => {
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
};

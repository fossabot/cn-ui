import { NullAtom } from "@cn-ui/reactive";
import { random } from "mockjs-ts";
import type { ColumnDef, MagicTableExpose } from "..";
import { MagicTable } from "../Table";
import { useTableVirtual } from "../useVirtual";
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
export const DefaultSelection = () => {
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
};

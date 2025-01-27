import { createColumnHelper } from "@tanstack/solid-table";
import { createStore } from "solid-js/store";
import { FormCheckBox } from "../../checkbox/FormCheckBox";
import { FormRadio } from "../../checkbox/FormRadio";
import { JSONViewer } from "../../dataViewer";
import { FormDatePicker, FormDateRangePicker } from "../../datePicker/FormDatePicker";
import { FormCoreRegister } from "../../form/FormCore";
import { FormInput } from "../../input/FormInput";
import { FormInputNumber } from "../../inputNumber/FormInputNumber";
import { FormSelect } from "../../select/FormSelect";
import { MagicTable } from "../Table";
import { FormTableCell } from "../slot/FormTableCell";

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

const defaultData: Person[] = [
    {
        firstName: "tanner",
        lastName: "linsley",
        age: 24,
        visits: 100,
        status: "In Relationship",
        progress: 50,
    },
    {
        firstName: "tandy",
        lastName: "miller",
        age: 40,
        visits: 40,
        status: "Single",
        progress: 80,
    },
    {
        firstName: "joe",
        lastName: "dirte",
        age: 45,
        visits: 20,
        status: "Complicated",
        progress: 10,
    },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
    columnHelper.group({
        id: "hello",
        header: () => <span>Hello</span>,
        // footer: props => props.column.id,
        columns: [
            columnHelper.accessor("firstName", {
                footer: (props) => props.column.id,
                type: "text",
            }),
            columnHelper.accessor((row) => row.lastName, {
                id: "lastName",
                cell: (info) => info.getValue(),
                header: () => <span>Last Name</span>,
                footer: (props) => props.column.id,
            }),
        ],
    }),
    columnHelper.group({
        header: "Info",
        footer: (props) => props.column.id,
        columns: [
            {
                accessorKey: "age",
                header: () => "Age",
                type: "number",
                footer: (props) => props.column.id,
            },
            columnHelper.group({
                header: "More Info",
                columns: [
                    columnHelper.accessor("visits", {
                        header: () => <span>Visits</span>,
                        footer: (props) => props.column.id,
                    }),
                    columnHelper.accessor("status", {
                        header: "Status",
                        footer: (props) => props.column.id,
                    }),
                    columnHelper.accessor("progress", {
                        header: "Profile Progress",
                        footer: (props) => props.column.id,
                    }),
                ],
            }),
        ],
    }),
];
FormCoreRegister.register("text", FormInput, { allowSameRegister: true });
FormCoreRegister.register("select", FormSelect, { allowSameRegister: true });
FormCoreRegister.register("number", FormInputNumber, {
    allowSameRegister: true,
});
FormCoreRegister.register("date", FormDatePicker, { allowSameRegister: true });
FormCoreRegister.register("date-range", FormDateRangePicker, {
    allowSameRegister: true,
});
FormCoreRegister.register("radio", FormRadio, { allowSameRegister: true });
FormCoreRegister.register("checkbox", FormCheckBox, {
    allowSameRegister: true,
});

export const FormTable = () => {
    const [rows, setRows] = createStore(defaultData);
    return (
        <>
            <JSONViewer data={rows} />
            <MagicTable
                data={rows}
                columns={columns}
                defaultCell={FormTableCell}
                onUpdateData={setRows}
            />
        </>
    );
};

import {
	OriginComponent,
	type OriginComponentInputType,
	atom,
	toCSSPx,
} from "@cn-ui/reactive";
import { createMemo } from "solid-js";
import { useScroll } from "solidjs-use";
import { MagicTableBody } from "./MagicTableBody";
import {
	MagicTableCtx,
	type MagicTableCtxType,
	MagicVirtualTableCtx,
} from "./MagicTableCtx";
import { MagicTableHeader } from "./MagicTableHeader";
import { useAutoResize } from "./hook/useAutoResize";
import type { MagicTableExpose, MagicTableProps } from "./interface";
import { useStaticTableDefine } from "./useStaticTableDefine";

export const MagicTable = OriginComponent(function <T>(
	props: OriginComponentInputType<MagicTableProps<T>>,
) {
	const tableContainerRef = atom<HTMLDivElement | null>(null);

	// 静态 table 的各项属性
	const staticTable = useStaticTableDefine(props);
	const { table, composedColumns, paddingLeft, paddingRight } = staticTable;
	// 虚拟 table 的各项属性
	const virtualSettings = props.virtual
		? props.virtual<T>(table, tableContainerRef, {
				paddingLeft,
				paddingRight,
				composedColumns,
				estimateHeight: () => props.estimateHeight,
			})
		: undefined;

	const { height, width } = useAutoResize(tableContainerRef);
	const tableScroll = useScroll(() =>
		props.virtual ? tableContainerRef() : tableContainerRef()?.parentElement,
	);

	const context = createMemo<MagicTableCtxType<T>>(() => ({
		...staticTable,
		tableProps: props,

		width,
		defaultCell: props.defaultCell,
		tableScroll,
		selection: () => props.selection,
		estimateHeight: () => props.estimateHeight,
	}));
	const expose: MagicTableExpose<T> = {
		...context(),
		clearSelection() {
			table.resetRowSelection();
		},
		getSelectionRows() {
			return table.getFilteredSelectedRowModel().rows.map((i) => i.original);
		},
		toggleAllSelection(selected) {
			table.toggleAllRowsSelected(selected);
		},
		toggleRowSelection(row, selected) {
			table.setRowSelection((selectedObj) => {
				selectedObj[row.toString()] = selected ?? !selectedObj[row.toString()];
				return selectedObj;
			});
		},
	};
	props.expose?.(expose);
	return (
		<MagicTableCtx.Provider value={context() as unknown as MagicTableCtxType}>
			<MagicVirtualTableCtx.Provider value={virtualSettings}>
				<table
					class={props.class(
						props.virtual && "block ",
						"relative overflow-auto border border-gray-200",
					)}
					style={
						props.virtual
							? {
									width: toCSSPx(
										Math.min(width(), virtualSettings!.tableWidth() + 5),
										"400px",
									),
									height: toCSSPx(props.height ?? height(), "400px"),
									...props.style(),
								}
							: props.style()
					}
					ref={(el) => {
						tableContainerRef(el);
						return props.ref?.(el);
					}}
				>
					<MagicTableHeader rowAbsolute={!!props.virtual} />
					<MagicTableBody rowAbsolute={!!props.virtual} />
				</table>
			</MagicVirtualTableCtx.Provider>
		</MagicTableCtx.Provider>
	);
});

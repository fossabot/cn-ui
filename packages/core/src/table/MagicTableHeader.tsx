import { toCSSPx } from "@cn-ui/reactive";
import { Key } from "@solid-primitives/keyed";
import { Show } from "solid-js";
import {
	MagicTableCtx,
	type MagicTableCtxType,
	MagicVirtualTableCtx,
} from "./MagicTableCtx";
import { HeaderRow } from "./slot/HeaderRow";

export function MagicTableHeader<T>(props: { rowAbsolute: boolean }) {
	const vTable = MagicVirtualTableCtx.use();
	const { table } = MagicTableCtx.use<MagicTableCtxType<T>>();

	return (
		<thead
			class="sticky top-0 z-10 block border-x border-b border-gray-200"
			style={
				props.rowAbsolute
					? {
							width: toCSSPx(
								props.rowAbsolute ? vTable.tableWidth() : "fit-content",
							),
						}
					: undefined
			}
		>
			{/* 左侧 fixed */}
			<Show when={table.getLeftLeafColumns().length}>
				<Key by="id" each={table.getLeftHeaderGroups()}>
					{(group, index) => {
						return (
							<HeaderRow
								position={"left"}
								absolute={true}
								headers={group().headers}
								level={index()}
								isLastRow={table.getLeftHeaderGroups().length - 1 === index()}
							/>
						);
					}}
				</Key>
			</Show>

			<Key by="id" each={table.getCenterHeaderGroups()}>
				{(group, index) => {
					return (
						<HeaderRow
							position={"center"}
							absolute={props.rowAbsolute}
							headers={group().headers}
							level={index()}
							isLastRow={table.getCenterHeaderGroups().length - 1 === index()}
						/>
					);
				}}
			</Key>
			{/* 右侧 fixed */}
			<Show when={table.getRightLeafColumns().length}>
				<Key by="id" each={table.getRightHeaderGroups()}>
					{(group, index) => {
						return (
							<HeaderRow
								position={"right"}
								absolute
								headers={group().headers}
								level={index()}
								isLastRow={table.getRightHeaderGroups().length - 1 === index()}
							/>
						);
					}}
				</Key>
			</Show>
		</thead>
	);
}

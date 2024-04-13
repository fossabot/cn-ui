import {
	ArrayAtom,
	type JSXSlot,
	OriginComponent,
	ensureFunctionResult,
} from "@cn-ui/reactive";
import type { SelectOptionsType } from "@cn-ui/reactive";
import { Key } from "@solid-primitives/keyed";
import { createMemo } from "solid-js";
import { Tag } from "./Tag";
export interface TagGroupOptions extends SelectOptionsType {
	icon?: JSXSlot;
	color?: string;
}

export interface TagGroupProps {
	maxSize?: number;
	closeable?: boolean;
	onClose?: (item: TagGroupOptions) => void;
}

export const TagGroup = OriginComponent<
	TagGroupProps,
	HTMLDivElement,
	TagGroupOptions[]
>((props) => {
	const group = ArrayAtom<TagGroupOptions[]>(props.model);
	const isHideSomeItems = createMemo(() => {
		if (!props.maxSize) return false;
		return group().length > props.maxSize;
	});
	const visibleItems = createMemo(() => {
		const showing = group()
			.slice(-(props.maxSize ?? 2))
			.reverse();
		if (isHideSomeItems())
			return [
				...showing,
				{
					value: "$index",
					label: `${group().length - props.maxSize!}+`,
				},
			];
		return showing;
	});
	return (
		<Key by={(i) => i.value ?? i.label} each={visibleItems()}>
			{(item) => {
				return (
					<Tag
						icon={ensureFunctionResult(item().icon)}
						color={item().color}
						onClose={() => {
							group.remove(item());
							props.onClose?.(item());
						}}
						closeable={props.closeable && item().value !== "$index"}
					>
						{ensureFunctionResult(item().label)}
					</Tag>
				);
			}}
		</Key>
	);
});

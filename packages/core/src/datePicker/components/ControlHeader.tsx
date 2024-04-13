import { DatePicker, useDatePickerContext } from "@ark-ui/solid";
import {
	AiOutlineDoubleLeft,
	AiOutlineDoubleRight,
	AiOutlineLeft,
	AiOutlineRight,
} from "solid-icons/ai";
import { Flex } from "../../container";
import { Icon } from "../../icon/Icon";

/** 头部的控制栏 */
export function ControlHeader() {
	const api = useDatePickerContext();
	const prevYear = () => api().focusYear(api().focusedValue.year - 1);
	const nextYear = () => api().focusYear(api().focusedValue.year + 1);
	const iconClass =
		"transition-colors cursor-pointer text-design-h2 hover:text-design-text";
	return (
		<Flex class="font-bold pb-1 mb-2 border-b border-design-border">
			<Icon onclick={prevYear} class={iconClass}>
				<AiOutlineDoubleLeft />
			</Icon>
			<DatePicker.PrevTrigger>
				<Icon class={iconClass}>
					<AiOutlineLeft />
				</Icon>
			</DatePicker.PrevTrigger>
			<DatePicker.ViewTrigger class="flex-1 text-sm">
				<DatePicker.RangeText />
			</DatePicker.ViewTrigger>
			<DatePicker.NextTrigger>
				<Icon class={iconClass}>
					<AiOutlineRight />
				</Icon>
			</DatePicker.NextTrigger>
			<Icon onclick={nextYear} class={iconClass}>
				<AiOutlineDoubleRight />
			</Icon>
		</Flex>
	);
}

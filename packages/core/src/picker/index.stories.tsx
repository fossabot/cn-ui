import Mock from "mockjs-ts";
import type { Meta, StoryObj } from "storybook-solidjs";
import { AddressPicker } from "./AddressPicker";
import { PickerColumn } from "./PickerColumn";

const meta = {
	title: "Data 数据展示/Picker 选择器",
	component: PickerColumn,
	argTypes: {},
} satisfies Meta<typeof PickerColumn>;

export default meta;
type Story = StoryObj<typeof meta>;
import { atom, computed, genArray } from "@cn-ui/reactive";
import "@vant/touch-emulator";
import { For } from "solid-js";
import { Flex } from "../container";
import type { SelectOptionsType } from "../select";

const mockData = () =>
	Mock.mock<{ data: SelectOptionsType[] }>({
		"data|10": [
			{
				label: "@cname",
				value: "@name",
			},
		],
	}).data;

export const Primary: Story = {
	render() {
		const data = atom<SelectOptionsType | null>(null);
		const options = mockData();
		return (
			<div>
				<div>
					<PickerColumn v-model={data} options={options} />
				</div>
				{data()?.label}
			</div>
		);
	},
	args: {},
};
export const Picker: Story = {
	render() {
		const data = genArray(3).map((i) => atom<SelectOptionsType | null>(null));

		const options = [mockData(), mockData(), mockData()];
		return (
			<div>
				<Flex class="w-full">
					<For each={options}>
						{(option, index) => {
							return (
								<PickerColumn
									visibleOptionNum={3}
									class="flex-1"
									v-model={data[index()]}
									options={option}
								/>
							);
						}}
					</For>
				</Flex>
				{data.map((i) => i()?.value)}
			</div>
		);
	},
	args: {},
};
import { getChinaAddressOptions } from "@cn-ui/area-data";
export const _AddressPicker: Story = {
	render() {
		const data = atom<SelectOptionsType[]>([]);
		const options = getChinaAddressOptions();
		return (
			<>
				<AddressPicker v-model={data} options={options} />
				{data().map((i) => i.label)}
			</>
		);
	},
	args: {},
};

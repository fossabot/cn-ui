import type { Meta, StoryObj } from "storybook-solidjs";

import { atom } from "@cn-ui/reactive";
import { JSONViewer } from "../dataViewer/index";
import type { CommonGroupListConfig } from "../groupList";
import { Cascader, CascaderPanel } from "./index";

const meta = {
	title: "Data 数据展示/Cascader 级联选择",
	component: CascaderPanel,
	argTypes: {},
} satisfies Meta<typeof CascaderPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
	{
		value: "jack",
		label: "Jack",
	},
	{
		value: "lucy",
		label: "Lucy",
		withSeparate: true,
	},
	{
		value: "tom",
		label: "Tom",
		options: [
			{
				value: "tom1",
				label: "Tom1",
				options: [
					{
						value: "jack2",
						label: "Jack",
					},
					{
						value: "lucy2",
						label: "Lucy",
						withSeparate: true,
					},
					{
						value: "tom2",
						label: "Tom2",
					},
					{
						value: "tom3",
						label: "Tom3",
					},
				],
			},
			{
				value: "tom1-1",
				label: "Tom2",
			},
			{
				value: "tom2-2",
				label: "Tom3",
			},
		],
	},
] as CommonGroupListConfig[];

export const Fold: Story = {
	name: "CascaderPanel 分组列表",
	render() {
		const selected = atom([]);
		return (
			<div class="flex gap-4 flex-col">
				<JSONViewer data={selected()} />
				<CascaderPanel options={options} v-model={selected} />
			</div>
		);
	},
	args: {},
};
export const Casca: Story = {
	name: "Cascader 分组列表",
	render() {
		const selected = atom([]);
		return (
			<div class="flex gap-4 flex-col">
				<JSONViewer data={selected()} />
				<Cascader options={options} v-model={selected} />
			</div>
		);
	},
	args: {},
};

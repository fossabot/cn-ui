import type { Meta, StoryObj } from "storybook-solidjs";

import { atom } from "@cn-ui/reactive";
import { toggleTheme } from "../utils";
import { SwitchBtn, ThemeSwitch } from "./index";

const meta = {
	title: "Data 数据展示/Switch 级联选择",
	component: ThemeSwitch,
	argTypes: {},
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const S: Story = {
	name: "Switch 切换",
	render() {
		return (
			<div class="flex gap-4 flex-col">
				<SwitchBtn />
			</div>
		);
	},
	args: {},
};
export const Fold: Story = {
	name: "ThemeSwitch 主题切换",
	render() {
		return (
			<div class="flex gap-4 flex-col">
				<ThemeSwitch onSwitch={(state, e) => toggleTheme(e, state)} />
			</div>
		);
	},
	args: {},
};

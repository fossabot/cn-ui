import type { Meta, StoryObj } from "storybook-solidjs";

import { NullAtom, atom } from "@cn-ui/reactive";
import { BaseInput, type InputExpose } from "./index";

const meta = {
	title: "Controls/BaseInput",
	component: BaseInput,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof BaseInput>;

export default meta;
type Story = StoryObj<typeof meta>;
import { AiOutlineUser } from "solid-icons/ai";
import { Icon } from "../icon/Icon";
export const Primary: Story = {
	render() {
		const data = atom("123232");
		return (
			<div class="flex gap-4">
				<BaseInput v-model={data} />
				<BaseInput v-model={data} disabled />
				<BaseInput v-model={data} suffixIcon={ClearControl} />
				<BaseInput
					v-model={data}
					prefixIcon={
						<Icon>
							<AiOutlineUser size={16} />
						</Icon>
					}
				/>
			</div>
		);
	},
	args: {},
};
export const Password: Story = {
	name: "Password 密码",
	render() {
		const data = atom("123232");
		return (
			<div class="flex gap-4">
				<BaseInput
					v-model={data}
					type="password"
					suffixIcon={PasswordControl}
				/>
				<BaseInput
					v-model={data}
					type="password"
					disabled
					suffixIcon={PasswordControl}
				/>
			</div>
		);
	},
	args: {},
};
import { runes } from "runes2";
import { Button } from "../button";
import { ClearControl, PasswordControl } from "./utils";

/** 右侧计数 */
export const Count: Story = {
	name: "Count 计数",
	render() {
		const data = atom("🔥🔥🔥");
		return (
			<div class="flex gap-4">
				<BaseInput v-model={data} count />
				<BaseInput
					v-model={data}
					count={{
						show: true,
						strategy: (txt) => runes(txt).length,
					}}
				/>
				<BaseInput
					v-model={atom("Hello world")}
					count={{
						show: true,
						max: 10,
					}}
				/>
				<BaseInput
					v-model={atom("Hello world")}
					count={{
						show: true,
						max: 10,
					}}
					allowExceed
				/>

				<BaseInput
					v-model={atom("🔥🔥🔥")}
					count={{
						show: true,
						max: 6,
						strategy: (txt) => runes(txt).length,
						exceedFormatter: (txt, { max }) =>
							runes(txt).slice(0, max).join(""),
					}}
				/>
			</div>
		);
	},
	args: {},
};
export const Expose: Story = {
	name: "Focus 聚焦",
	render() {
		const data = atom("123232");
		const inputExpose = NullAtom<InputExpose>(null);
		return (
			<div class="flex gap-4">
				<Button
					onClick={() => {
						inputExpose()!.focus({
							cursor: "start",
						});
					}}
				>
					Focus at first
				</Button>
				<Button
					onClick={() => {
						inputExpose()!.focus({
							cursor: "end",
						});
					}}
				>
					Focus at last
				</Button>
				<Button
					onClick={() => {
						inputExpose()!.focus({
							cursor: "all",
						});
					}}
				>
					Focus to select all
				</Button>
				<Button
					onClick={() => {
						inputExpose()!.focus({
							preventScroll: true,
						});
					}}
				>
					Focus prevent scroll
				</Button>
				{/* <Switch
                    checked={input}
                    checkedChildren="Input"
                    unCheckedChildren="TextArea"
                    onChange={() => {
                        setInput(!input)
                    }}
                /> */}
				<BaseInput v-model={data} expose={inputExpose} />
			</div>
		);
	},
	args: {},
};

export const Textarea: Story = {
	name: "Textarea 文本框",
	render() {
		const data = atom("123232");
		const inputExpose = NullAtom<InputExpose>(null);
		return (
			<BaseInput
				auto-size
				v-model={data}
				type="textarea"
				expose={inputExpose}
			/>
		);
	},
	args: {},
};

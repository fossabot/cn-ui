import type { Meta, StoryObj } from "storybook-solidjs";

import { resource } from "@cn-ui/reactive";
import Mock from "mockjs-ts";
import { For } from "solid-js";
import { Col, Row } from "../RowAndCol";
import { Avatar } from "./index";
const meta = {
	title: "Data 数据展示/Avatar 用户头像",
	component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

interface DataType {
	data: {
		id: string;
		avatar: string;
		title: string;
		message: string;
	}[];
}
/**  */
export const Primary: Story = {
	render() {
		const items = resource(
			async () =>
				Mock.mock<DataType>({
					"data|3": [
						{
							id: "@id",
							avatar: "@image(64x64)",
							title: "@title",
							message: "@sentence",
						},
					],
				}).data,
			{ initValue: [] },
		);
		return (
			<div class="h-screen flex flex-col">
				<Row>
					<For each={items()}>
						{(item) => {
							return (
								<Col span={4}>
									<Avatar src={item.avatar} fallback={"xxx"} />
								</Col>
							);
						}}
					</For>
				</Row>
			</div>
		);
	},
	args: {},
};

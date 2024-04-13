import type { Meta, StoryObj } from "storybook-solidjs";

import { photos } from "./example/photos";
import { WaterFall } from "./index";

const meta = {
	title: "Layout 布局组件/WaterFall 瀑布流",
	component: WaterFall,
	argTypes: {},
} satisfies Meta<typeof WaterFall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	render() {
		return (
			<WaterFall each={photos}>
				{(item) => {
					return (
						<img
							alt="non"
							class="object-cover w-full"
							height={item.height}
							width={item.width}
							src={item.src}
						/>
					);
				}}
			</WaterFall>
		);
	},
	args: {},
};

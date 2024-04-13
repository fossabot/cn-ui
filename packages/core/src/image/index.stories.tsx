import type { Meta, StoryObj } from "storybook-solidjs";

import { photos } from "../waterFall/example/photos";
import { Image } from "./index";

const meta = {
	title: "Basic 基础组件/Image",
	component: Image,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	render() {
		return <Image src={photos[0].src} />;
	},
	args: {},
};

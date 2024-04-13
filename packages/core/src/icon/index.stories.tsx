import type { Meta, StoryObj } from "storybook-solidjs";

import { Icon } from "./Icon";
import { IconSearch } from "./IconSearch";
const meta = {
    title: "Icon/Icon Search 图标搜索",
    component: Icon,
    argTypes: {},
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    name: "Icon Search 图标搜索",
    render() {
        return <IconSearch />;
    },
    args: {},
};

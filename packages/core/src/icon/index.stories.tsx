import type { Meta, StoryObj } from "storybook-solidjs";

import { Icon } from "./Icon";
import { IconSearch } from "./example/IconSearch";
const meta = {
    title: "DesignSystem 设计系统/Icon 图标",
    component: Icon,
    argTypes: {},
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    name: "Icon 图标",
    render() {
        return <IconSearch />;
    },
    args: {},
};

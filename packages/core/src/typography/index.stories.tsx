import type { Meta, StoryObj } from "storybook-solidjs";
import { Typo } from "./index";

const meta = {
    title: "Common 通用/Typography 排版渲染",
    component: Typo,
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof Typo>;

export default meta;
type Story = StoryObj<typeof meta>;
import { toggleTheme } from "..";
import { ThemeSwitch } from "../switch";
import { Heti } from "./example/Heti";

/**  */
export const Primary: Story = {
    name: "Typography 排版渲染",
    render() {
        return (
            <Typo class="max-w-2xl m-auto cn-indent">
                <ThemeSwitch onSwitch={() => toggleTheme()} />
                <Heti />
            </Typo>
        );
    },
    args: {},
};

// 额外附加类的需要测试和文档 cn-indent indent-none

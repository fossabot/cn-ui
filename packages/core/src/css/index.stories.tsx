import type { Meta, StoryObj } from "storybook-solidjs";

import { classNames } from "@cn-ui/reactive";
const meta = {
    title: "DesignSystem 设计系统/Color 色彩",
    component: () => null,
} satisfies Meta<null>;

export default meta;
type Story = StoryObj<typeof meta>;
import { Entries } from "@solid-primitives/keyed";
import * as copy from "copy-to-clipboard";
import type { Accessor } from "solid-js";
import { useDark, useToggle } from "solidjs-use";
import { Flex } from "../container";
import { ThemeSwitch } from "../switch";
import { colors, darkColors } from "./presets/colors";

export const Primary: Story = {
    name: "Color 色彩",
    render() {
        const [isDark, toggle] = useToggle(useDark());
        return (
            <div class="h-screen grid grid-cols-4 gap-4 m-12">
                <div class="col-span-4">
                    <h1 class="text-lg text-center font-bold my-2">色彩系统</h1>
                    <ThemeSwitch v-model={isDark} onSwitch={() => toggle()} />
                </div>
                <Entries of={isDark() ? darkColors : colors}>
                    {(colorName, data: Accessor<any>) => {
                        const isImportant = [
                            "primary",
                            "success",
                            "warning",
                            "error",
                            "design",
                        ].includes(colorName);
                        return (
                            <Flex
                                fill
                                vertical
                                justify="start"
                                class={classNames(
                                    isImportant && "border-primary-400",
                                    "bg-gray-50 rounded-lg  border-2 p-4 border-gray-400",
                                )}
                                gap="4px"
                            >
                                <div>
                                    {isImportant && "推荐使用"} {colorName.toUpperCase()}
                                </div>
                                <Entries of={data()}>
                                    {(num, value: Accessor<any>) => {
                                        if (num === "DEFAULT") return null;
                                        if (Number.parseInt(num) < 50) return null;
                                        const isLightText =
                                            Number.parseInt(num) >= 600 ||
                                            ["title", "h1", "h2"].includes(num);

                                        return (
                                            <Flex
                                                justify="space-between"
                                                class={classNames(
                                                    "w-full cursor-pointer transition hover:-translate-x-4 rounded-md px-4 py-1 font-light text-sm",
                                                    `bg-${colorName}-${num}`,
                                                    isLightText &&
                                                        (isDark() ? "text-black" : "text-white"),
                                                )}
                                                style={{
                                                    background: value(),
                                                }}
                                                onclick={() => {
                                                    copy(`bg-${colorName}-${num}`);
                                                }}
                                            >
                                                <span>{`bg-${colorName}-${num}`}</span>

                                                <span>{value()}</span>
                                            </Flex>
                                        );
                                    }}
                                </Entries>
                            </Flex>
                        );
                    }}
                </Entries>
            </div>
        );
    },
    args: {},
};

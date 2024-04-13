import type { Meta, StoryObj } from "storybook-solidjs";

import { expect, userEvent, waitFor, within } from "@storybook/test";
import { AiFillAlert, AiOutlineSearch } from "solid-icons/ai";
import { Flex } from "../container/Flex";
import { Icon } from "../icon/Icon";
import { toggleTheme } from "../utils/toggleTheme";
import { Button } from "./index";

const meta = {
    title: "Common 通用/Button 按钮",
    component: Button,
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    name: "Normal 正常渲染",
    render() {
        return (
            <Flex vertical gap="4px">
                <Flex gap="4px">
                    <Button
                        id="test-id-btn"
                        data-testid="btn"
                        class="my-btn"
                        style={{ "z-index": 1 }}
                        type="primary"
                        onclick={toggleTheme}
                        htmlType="submit"
                    >
                        按钮
                    </Button>
                    <Button onclick={toggleTheme}>按钮</Button>
                    <Button type="dashed" onclick={toggleTheme}>
                        按钮
                    </Button>
                    <Button type="text" onclick={toggleTheme}>
                        按钮
                    </Button>
                    <Button type="link" onclick={toggleTheme}>
                        按钮
                    </Button>
                </Flex>
                <Flex gap="4px">
                    <Button type="primary" danger>
                        按钮
                    </Button>
                    <Button danger>按钮</Button>
                    <Button type="dashed" danger>
                        按钮
                    </Button>
                    <Button type="text" danger>
                        按钮
                    </Button>
                    <Button type="link" danger>
                        按钮
                    </Button>
                </Flex>
                <Flex gap="4px">
                    <Button
                        type="primary"
                        disabled
                        data-testid="disabled-btn"
                        onclick={toggleTheme}
                    >
                        按钮
                    </Button>
                    <Button disabled>按钮</Button>
                    <Button type="dashed" disabled>
                        按钮
                    </Button>
                    <Button type="text" disabled>
                        按钮
                    </Button>
                    <Button type="link" disabled>
                        按钮
                    </Button>
                </Flex>
                <Flex gap="4px">
                    <Button type="primary" danger disabled>
                        按钮
                    </Button>
                    <Button danger disabled>
                        按钮
                    </Button>
                    <Button type="dashed" danger disabled>
                        按钮
                    </Button>
                    <Button type="text" danger disabled>
                        按钮
                    </Button>
                    <Button type="link" danger disabled>
                        按钮
                    </Button>
                </Flex>
            </Flex>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        await step("disabled 状态测试", async () => {
            // 点击按钮，无事件触发，dom 元素含有 disabled 属性
            await expectDarkTheme(false);
            const d = canvas.getByTestId("disabled-btn");
            await userEvent.click(d);
            expect(d).toBeDisabled();
            await expectDarkTheme(false);
        });

        await step("click 事件测试", async () => {
            await expectDarkTheme(false);
            await userEvent.click(canvas.getByTestId("btn"));

            await expectDarkTheme(true);
            await userEvent.click(canvas.getByTestId("btn"));

            await expectDarkTheme(false);
        });

        await step("id class style htmlType 属性继承", async () => {
            const btn = canvas.getByTestId("btn");
            expect(btn.id).toBe("test-id-btn");
            expect(btn.classList.contains("my-btn")).toBe(true);
            expect(btn.style.zIndex).toBe("1");
            expect(btn.getAttribute("type")).toBe("submit");
        });
    },
};
/** 判断 html 标签的 class 中包含 dark */
const expectDarkTheme = (target = true) =>
    waitFor(async () => {
        expect(document.documentElement.classList.contains("dark")).toBe(target);
    });

export const IconBtn: Story = {
    name: "Icon 模式",
    render() {
        const icon = () => (
            <Icon>
                <AiOutlineSearch />
            </Icon>
        );
        return (
            <Flex vertical gap="4px">
                <Flex gap="4px">
                    <Button
                        data-testid="icon-btn"
                        type="primary"
                        circle
                        icon={icon()}
                        aria-label="search"
                    />
                    <Button circle icon={icon()} aria-label="search" />
                    <Button type="primary" circle danger icon={icon()} aria-label="search" />
                    <Button
                        circle
                        danger
                        icon={() => {
                            return (
                                <Icon data-testid="replacedIcon">
                                    <AiFillAlert />
                                </Icon>
                            );
                        }}
                        aria-label="search"
                    />
                </Flex>
            </Flex>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        await step("icon 状态测试", async () => {
            // icon Btn 中包含一个 svg
            await expect(canvas.getByTestId("icon-btn").querySelector("svg")).toBeInTheDocument();
            // icon Btn 长宽相等
            expect(canvas.getByTestId("icon-btn").clientWidth).toBe(
                canvas.getByTestId("icon-btn").clientHeight,
            );
        });
        await step("icon Slot测试", async () => {
            // replacedIcon 在 屏幕中
            await expect(canvas.getByTestId("replacedIcon")).toBeInTheDocument();
        });
    },
};
export const loading: Story = {
    name: "Loading 模式",
    render() {
        const icon = () => (
            <Icon class="spinning">
                <AiOutlineSearch />
            </Icon>
        );
        return (
            <p>
                <Button
                    loading
                    data-testid="loading"
                    type="primary"
                    circle
                    block
                    icon={icon()}
                    onclick={toggleTheme}
                    loadingText="Loading"
                    class="my-2"
                />
                <Button class="my-2" loading loadingText="Loading" circle block icon={icon()} />
                <Button class="my-2" loading type="primary" danger block icon={icon()} />
                <Button
                    loading
                    class="my-2"
                    block
                    danger
                    icon={() => {
                        return (
                            <Icon class="spinning" data-testid="unreachable-loadingIcon">
                                <AiOutlineSearch />
                            </Icon>
                        );
                    }}
                    loadingIcon={() => {
                        return (
                            <Icon class="cn-animate-spin" data-testid="loadingIcon">
                                <AiOutlineSearch />
                            </Icon>
                        );
                    }}
                />
            </p>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        await step("透明度 状态测试", async () => {
            // .cn-button 的 opacity 低于 80
            canvas.getAllByText("加载中").forEach((i) => {
                expect(Number.parseFloat(getComputedStyle(i).opacity as string)).toBeLessThan(0.8);
            });
        });
        await step("LoadingText 状态测试", async () => {
            // loading 的文本是 Loading
            expect(canvas.getByTestId("loading")).toHaveTextContent("Loading");
            // 判断元素包含 加载中 的元素有 2 个
            expect(canvas.getAllByText("加载中").length).toBe(2);
        });
        await step("事件不可触发 状态测试", async () => {
            // 测试 loading 不能触发 click 事件
            expect(canvas.getByTestId("loading")).toHaveClass("pointer-events-none");
        });
        // 测试 unreachable-loadingIcon 不在屏幕，loadingIcon 在屏幕内
        await step("loadingIcon Slot 测试", async () => {
            await expect(canvas.queryByTestId("unreachable-loadingIcon")).toBeFalsy();
            await expect(canvas.getByTestId("loadingIcon")).toBeInTheDocument();
        });
    },
};

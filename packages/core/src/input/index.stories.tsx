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
                <Button
                    aria-label="Clear"
                    onclick={() => {
                        data("");
                    }}
                >
                    Clear
                </Button>
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        await step("检查初始状态", () => {
            // 检查所有 input 的值为123232
            canvas.getAllByRole("textbox").forEach((i) => {
                expect(i).toHaveDisplayValue("123232");
            });
            // 检查第二个input 的值为 disabled
            expect(canvas.getAllByRole("textbox")[1]).toBeDisabled();
        });
        await step("状态更改与联动测试", async () => {
            canvas.getAllByRole("textbox")[3].focus();
            await userEvent.click(canvas.getByLabelText("清空按钮"));
            canvas.getAllByRole("textbox").forEach((i) => {
                expect(i).toHaveDisplayValue("");
            });
            // 将第一个 input 的值设置为 2333，检查所有 input 值为 2333
            canvas.getAllByRole("textbox")[0].focus();
            await userEvent.type(canvas.getAllByRole("textbox")[0], "2333");
            canvas.getAllByRole("textbox").forEach((i) => {
                expect(i).toHaveDisplayValue("2333");
            });
        });
        // 点击 reset 按钮，重置所有数据
        await step("点击 reset 按钮，重置所有数据", async () => {
            await userEvent.click(canvas.getByLabelText("Clear"));
            canvas.getAllByRole("textbox").forEach((i) => {
                expect(i).toHaveDisplayValue("");
            });
        });
    },
};
export const Password: Story = {
    name: "Password 密码",
    render() {
        const data = atom("123232");
        return (
            <div class="flex gap-4">
                <BaseInput
                    aria-label="password"
                    v-model={data}
                    type="password"
                    suffixIcon={PasswordControl}
                />
                <BaseInput
                    aria-label="password-disabled"
                    v-model={data}
                    type="password"
                    disabled
                    suffixIcon={PasswordControl}
                />
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        await step("检查初始状态", () => {
            expect(canvas.getByLabelText("password")).toHaveAttribute("type", "password");
            expect(canvas.getByLabelText("password-disabled")).toBeDisabled();
        });
        await step("解除 password 状态", async () => {
            await userEvent.click(canvas.getAllByLabelText("更改密码显隐")[0]);
            expect(canvas.getByLabelText("password")).not.toHaveAttribute("type", "password");
            await userEvent.click(canvas.getAllByLabelText("更改密码显隐")[0]);
            expect(canvas.getByLabelText("password")).toHaveAttribute("type", "password");
        });
    },
};
import { expect, userEvent, within } from "@storybook/test";
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
                <BaseInput placeholder="普通测试" id="123" v-model={data} count />
                <BaseInput
                    placeholder="自定义测试"
                    v-model={data}
                    count={{
                        show: true,
                        strategy: (txt) => runes(txt).length,
                    }}
                />
                <BaseInput
                    placeholder="最大值测试"
                    v-model={atom("Hello world")}
                    count={{
                        show: true,
                        max: 10,
                    }}
                />
                <BaseInput
                    placeholder="允许超过最大值"
                    v-model={atom("Hello world")}
                    count={{
                        show: true,
                        max: 10,
                    }}
                    allowExceed
                />

                <BaseInput
                    placeholder="自定义计算"
                    v-model={atom("🔥🔥🔥")}
                    count={{
                        show: true,
                        max: 6,
                        strategy: (txt) => runes(txt).length,
                        exceedFormatter: (txt, { max }) => runes(txt).slice(0, max).join(""),
                    }}
                />
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        await step("检查初始状态", () => {
            expect(canvas.getByPlaceholderText("普通测试").id).toEqual("123");
            expect(canvas.getByPlaceholderText("普通测试").nextElementSibling).toHaveTextContent(
                "6",
            );
            expect(canvas.getByPlaceholderText("自定义测试").nextElementSibling).toHaveTextContent(
                "3",
            );
            expect(canvas.getByPlaceholderText("最大值测试")).toHaveValue("Hello worl");
            expect(canvas.getByPlaceholderText("最大值测试").nextElementSibling).toHaveTextContent(
                "10 / 10",
            );
            expect(canvas.getByPlaceholderText("允许超过最大值")).toHaveValue("Hello world");
            expect(
                canvas.getByPlaceholderText("允许超过最大值").nextElementSibling,
            ).toHaveTextContent("11 / 10");

            expect(canvas.getByPlaceholderText("自定义计算").nextElementSibling).toHaveTextContent(
                "3 / 6",
            );
        });
    },
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
                placeholder="请输入内容"
                autoSize
                v-model={data}
                type="textarea"
                expose={inputExpose}
            />
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const target = canvas.getByPlaceholderText("请输入内容");
        await step("检查初始状态", () => {
            expect(target).toHaveValue("123232");
            expect(target).toHaveAttribute("type", "textarea");
        });
        await step("检查动态高度", async () => {
            await userEvent.type(target, "123232\n\n\n");
            // 判断其高度大于 300
            expect(target.clientHeight).toBeGreaterThan(70);
            /** @ts-ignore */
            target.value = "";
            await userEvent.type(target, "123232");
            expect(target.clientHeight).toBeLessThan(50);
        });
    },
};

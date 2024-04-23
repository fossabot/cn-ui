import type { Meta, StoryObj } from "storybook-solidjs";

import { SelectOptionsType, atom, sleep } from "@cn-ui/reactive";
import { createEffect } from "solid-js";
import { Button } from "../button";
import { Alert, Message } from "./index";
import { expect, userEvent, within } from "@storybook/test";
import { Select } from "../select";
import { MODAL_LIST_POSITION, ModalListPosition } from "../Modal";

const meta = {
    title: "Feedback 反馈组件/Message 消息弹窗",
    component: Alert,
    argTypes: {},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render() {
        const data = atom<{ name: string; id: string }[]>([], { equals: false });
        createEffect(() => {
            console.log(data());
        });

        return (
            <div class="flex flex-col gap-4">
                {(["success", "error", "warning", "info"] as const).map((i) => {
                    return <Alert message="你好吗" type={i} closable icon />;
                })}
                {(["success", "error", "warning", "info"] as const).map((i) => {
                    return <Alert message="你好吗" type={i} closable icon round border />;
                })}
                {(["success", "error", "warning", "info"] as const).map((i) => {
                    return (
                        <Alert
                            message="你好吗"
                            type={i}
                            closable
                            icon
                            round
                            border
                            description={Array(50).fill(i).join(",")}
                        />
                    );
                })}
            </div>
        );
    },
    args: {},
};

export const MessageLog: Story = {
    render() {
        const pos = atom(["top"]);
        return (
            <div class="flex flex-col gap-4">
                <Select
                    v-model={pos}
                    options={
                        MODAL_LIST_POSITION.map((i) => ({
                            label: i,
                            value: i,
                        })) as SelectOptionsType[]
                    }
                ></Select>
                {(["success", "error", "warning", "info"] as const).map((i) => {
                    return (
                        <Button
                            onclick={() =>
                                Message[i](i + "-message", {
                                    position: pos()[0] as ModalListPosition,
                                    duration: 100,
                                })
                            }
                        >
                            {i}
                        </Button>
                    );
                })}
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const messageArea = Object.fromEntries(
            MODAL_LIST_POSITION.map((i) => {
                return [i, within(document.querySelector("#cn-message-" + i)!)];
            }),
        );
        const checkPosSpec = async (pos: ModalListPosition) => {
            await userEvent.click(canvas.getByText("success"));
            await userEvent.click(canvas.getByText("error"));
            await userEvent.click(canvas.getByText("warning"));
            await userEvent.click(canvas.getByText("info"));

            expect(await messageArea[pos].findByText("success-message")).toBeInTheDocument();
            expect(await messageArea[pos].findByText("error-message")).toBeInTheDocument();
            expect(await messageArea[pos].findByText("warning-message")).toBeInTheDocument();
            expect(await messageArea[pos].findByText("info-message")).toBeInTheDocument();
            await sleep(500);

            expect(messageArea[pos].queryByText("success-message")).toBeFalsy();
            expect(messageArea[pos].queryByText("error-message")).toBeFalsy();
            expect(messageArea[pos].queryByText("warning-message")).toBeFalsy();
            expect(messageArea[pos].queryByText("info-message")).toBeFalsy();
        };
        await step("检查点击触发状态", async () => {
            await checkPosSpec("top");
        });
        for (const pos of MODAL_LIST_POSITION) {
            await step("切换" + pos, async () => {
                await userEvent.click(canvas.getByRole("textbox"));
                await userEvent.click(canvas.getByText(pos));
                await checkPosSpec(pos);
            });
        }
    },
};

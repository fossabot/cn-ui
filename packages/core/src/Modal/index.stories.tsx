import type { Meta, StoryObj } from "storybook-solidjs";

import { atom } from "@cn-ui/reactive";
import Mock from "mockjs-ts";
import { createEffect } from "solid-js";
import { Button } from "../button";
import { Flex } from "../container";
import { ModalList } from "./index";

const meta = {
    title: "Feedback 反馈组件/Modal 模态框",
    component: ModalList,
    argTypes: {},
} satisfies Meta<typeof ModalList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render() {
        const data = atom<{ name: string; id: string }[]>([], { equals: false });
        createEffect(() => {
            console.log(data());
        });
        return (
            <>
                <Flex>
                    <Button
                        class="flex-1"
                        onclick={() =>
                            data((i) => {
                                i.unshift(Mock.mock({ id: "@id", name: i.length }));
                                return i;
                            })
                        }
                    >
                        弹出
                    </Button>
                </Flex>
                <ModalList v-model={atom(true)} each={data()} by={(i) => i.id} position="bottom">
                    {(item) => {
                        return <div>{item.name}</div>;
                    }}
                </ModalList>
            </>
        );
    },
    args: {},
};

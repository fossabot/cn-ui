import type { Meta, StoryObj } from "storybook-solidjs";

import { atom } from "@cn-ui/reactive";
import { SortableList } from "@cn-ui/sortable";
import Mock from "mockjs-ts";
import { For } from "solid-js";
import { Flex } from "../container";
import { Tag } from "./index";

const meta = {
    title: "Basic 基础组件/Tag 标签组件",
    component: Tag,
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render() {
        const data = Mock.mock<{ data: { text: string; color: string }[] }>({
            "data|10": [
                {
                    text: "@cname",
                    color: "@color",
                },
            ],
        });
        return (
            <Flex gap={"4px"}>
                <For each={data.data}>
                    {(item) => {
                        return <Tag color={item.color}>{item.text}</Tag>;
                    }}
                </For>
            </Flex>
        );
    },
    args: {},
};
export const Sortable: Story = {
    render() {
        const data = atom(
            Mock.mock<{
                data: {
                    id: string;
                    text: string;
                    color: string;
                }[];
            }>({
                "data|10": [
                    {
                        id: "@id",
                        value: "@id",
                        text: "@cname",
                        color: "@color",
                    },
                ],
            }).data,
        );
        return (
            <SortableList v-model={data} class="flex gap-4">
                {(item) => {
                    return <Tag color={item.color}>{item.text}</Tag>;
                }}
            </SortableList>
        );
    },
    args: {},
};

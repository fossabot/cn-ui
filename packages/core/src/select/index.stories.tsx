import type { Meta, StoryObj } from "storybook-solidjs";

import { type SelectOptionsType, atom, computed, genArray, resource } from "@cn-ui/reactive";
import Mock from "mockjs-ts";
import { JSONViewer } from "../dataViewer";
import { Select } from "./index";
import { within } from "@storybook/test";
const meta = {
    title: "Controls/Select 选择器",
    component: Select,
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    name: "Select 单选框",
    render() {
        const selected = atom([])
        return (
            <div class="flex gap-4">
                <Select
                    v-model={selected}
                    aria-label="selected"
                    filterable
                    options={[
                        {
                            value: "jack",
                            label: "Jack",
                        },
                        {
                            value: "lucy",
                            label: "Lucy",
                        },
                        {
                            value: "tom",
                            label: "Tom",
                        },
                    ]}
                />
                <Select
                    v-model={selected}
                    aria-label="selected"
                    options={[
                        {
                            value: "jack",
                            label: "Jack",
                        },
                        {
                            value: "lucy",
                            label: "Lucy",
                        },
                        {
                            value: "tom",
                            label: "Tom",
                        },
                    ]}
                />
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        await step("检查点击弹出", () => {});
    },
};

export const Multi: Story = {
    name: "Multiple 多选",
    render() {
        const res = resource(
            async () =>
                Mock.mock<{ data: SelectOptionsType[] }>({
                    "data|10": [
                        {
                            value: "@name",
                            label: "@cname",
                        },
                    ],
                }).data,
            { initValue: [] },
        );
        const selected = atom([]);
        const options = computed(() => [{ label: "Jack", value: "jack" }, ...res()]);
        return (
            <>
                <JSONViewer data={selected()} />
                <div class="flex gap-4">
                    <Select
                        v-model={selected}
                        disabledOptions={["jack"]}
                        multiple
                        options={options()}
                    />
                    <Select
                        v-model={selected}
                        disabledOptions={["jack"]}
                        multiple
                        options={options()}
                    />
                </div>
            </>
        );
    },
    args: {},
};

export const Search: Story = {
    name: "Remote Search 远程搜索",
    render() {
        const res = resource(
            async () =>
                Mock.mock<{ data: SelectOptionsType[] }>({
                    "data|10": [
                        {
                            value: "@name",
                            label: "@cname",
                        },
                    ],
                }).data,
            { initValue: [] },
        );

        return (
            <div class="flex flex-col gap-4">
                <Select options={res()} onInput={res.refetch} />
            </div>
        );
    },
    args: {},
};

export const Virtual: Story = {
    name: "Virtual 虚拟化",
    render() {
        const options = genArray(10000).map((i) => {
            return {
                value: `jack${i}`,
                label: `Jack${i}`,
            };
        });
        return (
            <div class="flex gap-4">
                <Select filterable multiple options={options} />
            </div>
        );
    },
    args: {},
};

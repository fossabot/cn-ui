import type { Meta, StoryObj } from "storybook-solidjs";

import { type SelectOptionsType, atom, computed, genArray, resource, sleep } from "@cn-ui/reactive";
import { expect, userEvent, within } from "@storybook/test";
import Mock from "mockjs-ts";
import { JSONViewer } from "../dataViewer";
import { Select } from "./index";
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
        const selected = atom([]);
        return (
            <div class="flex gap-4">
                <Select
                    v-model={selected}
                    aria-label="selected-filterable"
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
        await step("检查点击弹出", async () => {
            await userEvent.click(canvas.getByLabelText("selected-filterable"));
            expect(canvas.getByRole("tooltip")).toBeInTheDocument();
            expect(canvas.getByRole("listbox")).toBeInTheDocument();
            expect(canvas.getByText("Jack")).toBeInTheDocument();
            expect(canvas.getByText("Lucy")).toBeInTheDocument();
            expect(canvas.getByText("Tom")).toBeInTheDocument();

            // 点击别的地方隐藏
            await userEvent.click(canvasElement);
            expect(canvas.getByText("Jack")).not.toBeVisible();
            expect(canvas.getByText("Lucy")).not.toBeVisible();
            expect(canvas.getByText("Tom")).not.toBeVisible();
        });
        await step("检查选中切换", async () => {
            const filterable = canvas.getByLabelText("selected-filterable");
            const another = canvas.getByLabelText("selected");

            await userEvent.click(canvas.getByText("Jack"));
            filterable.focus();
            await sleep(100);
            expect(filterable).toHaveAttribute("placeholder", "Jack");

            filterable.blur();
            await sleep(100);

            expect(filterable).toHaveDisplayValue("Jack");
            expect(another).toHaveDisplayValue("Jack");
        });
        await step("filterable 测试", async () => {
            const filterable = canvas.getByLabelText("selected-filterable");

            filterable.focus();
            await sleep(100);
            canvas.getAllByRole("option").forEach((i)=>{

                expect(i).toBeVisible();
            })
            expect(canvas.getAllByRole("option").length).toBe(3);

            await userEvent.type(filterable, "Luc");
            await userEvent.click(canvas.getByText("Lucy"));
            expect(filterable).toHaveDisplayValue("Lucy");
        });
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

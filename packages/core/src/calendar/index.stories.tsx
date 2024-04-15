import type { Meta, StoryObj } from "storybook-solidjs";

import { atom } from "@cn-ui/reactive";
import { expect, userEvent, within } from "@storybook/test";
import dayjs from "dayjs";
import { Flex } from "../container";
import { Calendar } from "./index";

const meta = {
    title: "Controls/Calendar 日历",
    component: Calendar,
    argTypes: {},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    name: "日历面板",
    render() {
        const date = atom([dayjs("2024-04-15")]);
        return (
            <Flex gap="20px">
                <Calendar data-testid="single" v-model={date} />
                <Calendar data-testid="multiple" v-model={date} mode="multiple" />
                <Calendar data-testid="range" v-model={date} mode="range" />
            </Flex>
        );
    },
    play: async ({ canvasElement, step }) => {
        const single = within(within(canvasElement).getByTestId("single"));
        const multiple = within(within(canvasElement).getByTestId("multiple"));
        const range = within(within(canvasElement).getByTestId("range"));

        const getSelected = (part: string) => [
            ...within(canvasElement).getByTestId(part).querySelectorAll('[aria-selected="true"]'),
        ];
        await step("初始状态检测", async () => {
            for (const page of [single, multiple, range]) {
                // 15 的状态被选中
                await expect(page.getByLabelText("2024 04 15")).toHaveClass("cn-selected");

                // 日  一 二 三 四 五 六 在页面中
                const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
                for (const weekday of weekdays) {
                    await expect(page.getByText(weekday)).toBeInTheDocument();
                }

                // 页面中有两个 1 2 3 4
                const numbers = ["1", "2", "3"];
                for (const num of numbers) {
                    const elements = page.getAllByText(num);
                    await expect(elements.length).toBe(2);
                }
            }
        });
        await step("选取下一个月的日期，将会跳入下一月", async () => {
            for (const page of [single, multiple, range]) {
                await userEvent.click(page.getByLabelText("2024 05 01"));

                // 确认跳转后的页面状态
                expect(page.getByLabelText("5月 点击进入月面板")).toHaveTextContent("5");

                await userEvent.click(page.getByLabelText("2024 04 30"));

                // 确认跳转后的页面状态
                expect(page.getByLabelText("4月 点击进入月面板")).toHaveTextContent("4");

                await userEvent.click(page.getByLabelText("2024 04 15"));
            }
        });
        await step("左右月跳转测试", async () => {
            for (const page of [single, multiple, range]) {
                await userEvent.click(page.getByLabelText("上一月"));
                expect(page.getByLabelText("3月 点击进入月面板")).toHaveTextContent("3");
                await userEvent.click(page.getByLabelText("上一年"));
                expect(page.getByLabelText("2023年 点击进入年面板")).toHaveTextContent("2023");
                await userEvent.click(page.getByLabelText("下一年"));
                expect(page.getByLabelText("2024年 点击进入年面板")).toHaveTextContent("2024");

                await userEvent.click(page.getByLabelText("下一月"));
                expect(page.getByLabelText("4月 点击进入月面板")).toHaveTextContent("4");
            }
        });

        await step("多选时间测试", async () => {
            for (const page of [multiple]) {
                await userEvent.click(page.getByLabelText("2024 04 14"));
                await userEvent.click(page.getByLabelText("2024 04 15"));
                await userEvent.click(page.getByLabelText("2024 04 16"));
                await userEvent.click(page.getByLabelText("2024 04 17"));
                await userEvent.click(page.getByLabelText("2024 04 18"));
                expect(
                    getSelected("multiple").map((i) => {
                        return i.textContent;
                    }),
                ).toEqual(["14", "16", "17", "18"]);
            }
        });

        await step("区间选取时间测试", async () => {
            for (const page of [range]) {
                await userEvent.click(page.getByLabelText("2024 04 18"));
                await expect(
                    getSelected("range").map((i) => {
                        return i.textContent;
                    }),
                ).toEqual(["14", "15", "16", "17", "18"]);
            }
        });
        await step("已有区间，点击另外节点清空区间并选中", async () => {
            for (const page of [range]) {
                await userEvent.click(page.getByLabelText("2024 04 01"));
                await expect(
                    getSelected("range").map((i) => {
                        return i.textContent;
                    }),
                ).toEqual([]);
                await userEvent.click(page.getByLabelText("2024 04 02"));
                await expect(
                    getSelected("range").map((i) => {
                        return i.textContent;
                    }),
                ).toEqual(["1", "2"]);
            }
        });
    },
};
export const Second: Story = {
    name: "月份面板",
    render() {
        const date = atom([dayjs("2024-04-15")]);
        return (
            <Flex gap="20px">
                <Calendar v-model={date} type="month" />
                <Calendar v-model={date} type="month" mode="multiple" />
                <Calendar v-model={date} type="month" mode="range" />
            </Flex>
        );
    },
    args: {},
};
export const Year: Story = {
    name: "年份面板",
    render() {
        const date = atom([dayjs("2024-04-15")]);
        return (
            <Flex gap="20px">
                <Calendar v-model={date} type="year" />
                <Calendar v-model={date} type="year" mode="multiple" />
                <Calendar v-model={date} type="year" mode="range" />
            </Flex>
        );
    },
    args: {},
};

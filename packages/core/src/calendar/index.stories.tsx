import type { Meta, StoryObj } from "storybook-solidjs";

import { atom } from "@cn-ui/reactive";
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
        const date = atom([dayjs('2024-04-15')]);
        return (
            <Flex gap="20px">
                <Calendar v-model={date} />
                <Calendar v-model={date} mode="multiple" />
                <Calendar v-model={date} mode="range" />
            </Flex>
        );
    },
    args: {},
};
export const Second: Story = {
    name: "月份面板",
    render() {
        const date = atom([dayjs('2024-04-15')]);
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
        const date = atom([dayjs('2024-04-15')]);
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

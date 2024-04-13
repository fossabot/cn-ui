import type { Meta, StoryObj } from "storybook-solidjs";

import { atom } from "@cn-ui/reactive";
import { DatePanel, DatePicker } from "./index";

const meta = {
    title: "Controls/DatePanel 日期选择",
    component: DatePanel,
    argTypes: {},
} satisfies Meta<typeof DatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    name: "DatePanel 日历面板",
    render() {
        const date = atom<Date[]>([new Date()]);
        return (
            <>
                <DatePanel v-model={date} />
                <div>{date().map((i) => i.toString())}</div>
            </>
        );
    },
    args: {},
};
export const Se: Story = {
    name: "SingleDate 日期单选",
    render() {
        const date = atom<Date[]>([]);
        return (
            <>
                <DatePicker v-model={date} />
            </>
        );
    },
    args: {},
};
export const D: Story = {
    name: "DateRange 日期区间",
    render() {
        const date = atom<Date[]>([]);
        return (
            <>
                <DatePicker v-model={date} mode="range" />
            </>
        );
    },
    args: {},
};
export const G: Story = {
    name: "MultiDate 多个日期",
    render() {
        const date = atom<Date[]>([]);
        return <DatePicker v-model={date} mode="multiple" />;
    },
    args: {},
};

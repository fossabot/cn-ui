import type { Meta, StoryObj } from "storybook-solidjs";

import { ArrayFolder, atom } from "@cn-ui/reactive";
import Mock from "mockjs-ts";
import { VirtualList, type VirtualListExpose } from "./VirtualList";
import { expect, within } from "@storybook/test";
const meta = {
    title: "Data 数据展示/VirtualList 虚拟列表",
    component: VirtualList,
} satisfies Meta<typeof VirtualList>;

export default meta;
export type Story = StoryObj<typeof meta>;

interface DataType {
    data: string[];
}
/**  */
export const Primary: Story = {
    name: "ListRender 列表渲染",
    render() {
        const cellsSize = 100 * 1000;
        const items = atom(ArrayFolder([...Array(cellsSize).keys()], 100));
        return (
            <div class="h-screen flex flex-col">
                <div class="h-24">100x1000</div>
                <VirtualList each={items()} estimateSize={24}>
                    {(item, index, { itemClass }) => {
                        return (
                            <div class="h-6 bg-gray-100 flex">
                                {item.map((i) => {
                                    return <div class="w-24 flex-none">{i}</div>;
                                })}
                            </div>
                        );
                    }}
                </VirtualList>
            </div>
        );
    },
    args: {},
};
export const DynamicHeight: Story = {
    name: "DynamicHeight 不等高测试",
    render() {
        const cellsSize = 1000;
        const items = atom(
            Mock.mock<{ data: string[] }>({ [`data|${cellsSize}`]: ["@paragraph"] }).data,
        );

        return (
            <div class="h-[80vh] flex flex-col">
                <div class="h-24">1000</div>
                <VirtualList
                    data-testid="v-list"
                    each={items()}
                    estimateSize={36}
                    expose={(expose) => {
                        (globalThis as any).expose = expose;
                    }}
                >
                    {(item, index) => {
                        return (
                            <div class=" bg-gray-100 flex py-4">
                                <mark data-testid="index">{index()}</mark>
                                {item}
                            </div>
                        );
                    }}
                </VirtualList>
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const expose: VirtualListExpose = (globalThis as any).expose;
        // 将 v-list 滚动到最末尾
        await step("滚动到最末尾", async () => {
            await expose.virtualizer.scrollToIndex(1000, { align: "center" });
            await expect(
                (await canvas.findAllByTestId("index")).every(
                    (i) => Number.parseInt(i.textContent!) >= 900,
                ),
            ).toBe(true);
        });
        await step("滚动到最前面", async () => {
            await expose.virtualizer.scrollToIndex(0);
            // 判断 0 在视野中
            expect(await canvas.findByText("0")).toBeInTheDocument();
        });
        const list = canvasElement.querySelector(".cn-virtual-list-container");
        await step("判断 list 高度大于宽度", async () => {
            const style = getComputedStyle(list!);
            expect(Number.parseInt(style.height)).toBeGreaterThan(Number.parseInt(style.width));
        });
    },
};
export const horizontal: Story = {
    name: "Horizontal 横向测试",
    render() {
        const cellsSize = 1000;
        const items = atom(
            Mock.mock<{ data: string[] }>({ [`data|${cellsSize}`]: ["@paragraph"] }).data,
        );

        return (
            <div class="h-[80vh] flex flex-col">
                <div class="h-24">1000</div>
                <VirtualList
                    data-testid="v-list"
                    class="flex-1"
                    horizontal
                    each={items()}
                    estimateSize={36}
                    expose={(expose) => {
                        (globalThis as any).expose = expose;
                    }}
                >
                    {(item, index) => {
                        return (
                            <div class="h-full w-24 bg-gray-100 flex py-4">
                                <mark data-testid="index">{index()}</mark>
                                {item}
                            </div>
                        );
                    }}
                </VirtualList>
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const expose: VirtualListExpose = (globalThis as any).expose;
        const list = canvasElement.querySelector(".cn-virtual-list-container");
        await step("判断 list 宽度大于高度", async () => {
            const style = getComputedStyle(list!);
            expect(Number.parseInt(style.width)).toBeGreaterThan(Number.parseInt(style.height));
        });
    },
};
export const Reverse: Story = {
    name: "Reverse 反向渲染",
    render() {
        const cellsSize = 1000;
        const items = atom(
            Mock.mock<{ data: string[] }>({ [`data|${cellsSize}`]: ["@paragraph"] }).data,
        );

        return (
            <div class="h-[80vh] flex flex-col">
                <div class="h-24">1000</div>
                <VirtualList
                    data-testid="v-list"
                    class="flex-1"
                    reverse
                    each={items()}
                    estimateSize={36}
                    expose={(expose) => {
                        (globalThis as any).expose = expose;
                    }}
                >
                    {(item, index) => {
                        return (
                            <div class="w-full bg-gray-100 flex py-4">
                                <mark data-testid="index">{index()}</mark>
                                {item}
                            </div>
                        );
                    }}
                </VirtualList>
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const expose: VirtualListExpose = (globalThis as any).expose;
        const list = canvasElement.querySelector(".cn-virtual-list-container");
        await step("判断 list 高度大于宽度", async () => {
            const style = getComputedStyle(list!);
            expect(Number.parseInt(style.height)).toBeGreaterThan(Number.parseInt(style.width));
        });
    },
};
export const H_Reverse: Story = {
    name: "H_Reverse 横向反向测试",
    render() {
        const cellsSize = 1000;
        const items = atom(
            Mock.mock<{ data: string[] }>({ [`data|${cellsSize}`]: ["@paragraph"] }).data,
        );

        return (
            <div class="h-[80vh] flex flex-col">
                <div class="h-24">1000</div>
                <VirtualList
                    data-testid="v-list"
                    class="flex-1"
                    reverse
                    horizontal
                    each={items()}
                    estimateSize={36}
                    expose={(expose) => {
                        (globalThis as any).expose = expose;
                    }}
                >
                    {(item, index) => {
                        return (
                            <div class="h-full w-24 bg-gray-100 flex py-4">
                                <mark data-testid="index">{index()}</mark>
                                {item}
                            </div>
                        );
                    }}
                </VirtualList>
            </div>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const expose: VirtualListExpose = (globalThis as any).expose;
        const list = canvasElement.querySelector(".cn-virtual-list-container");
        // 判断滚动条在 0 位置，并且 0 在视图中
        await step("判断滚动条在 0 位置，并且 0 在视图中", async () => {
            expect(await canvas.findByText("0")).toBeInTheDocument();
            expect(list?.scrollLeft).toBe(0);
        });
        await step("判断 list 宽度大于高度", async () => {
            const style = getComputedStyle(list!);
            expect(Number.parseInt(style.width)).toBeGreaterThan(Number.parseInt(style.height));
        });
    },
};

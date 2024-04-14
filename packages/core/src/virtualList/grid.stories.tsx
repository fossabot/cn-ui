import { ArrayFolder, atom } from "@cn-ui/reactive";
import { VirtualGrid } from "./VirtualGrid";
import type { Meta, StoryObj } from "storybook-solidjs";
const meta = {
    title: "Data 数据展示/VirtualGrid 虚拟列表",
    component: VirtualGrid,
} satisfies Meta<typeof VirtualGrid>;

export default meta;
export type Story = StoryObj<typeof meta>;
export const GridRender: Story = {
    name: "GridRender 网格渲染",
    render() {
        const cellsSize = 1000 * 1000;
        const items = atom(ArrayFolder([...Array(cellsSize).keys()], 1000));
        return (
            <div class="h-screen flex flex-col">
                <div class="h-24">1000x1000</div>
                <VirtualGrid each={items()}>
                    {(item) => {
                        return <div class="w-24 h-6 flex-none">{item}</div>;
                    }}
                </VirtualGrid>
            </div>
        );
    },
    args: {},
};

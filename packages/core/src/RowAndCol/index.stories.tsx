import type { Meta, StoryObj } from "storybook-solidjs";

import { sleep } from "@cn-ui/reactive";
import { expect, within } from "@storybook/test";
import { Col, Row } from "./index";

const meta = {
    title: "Layout 布局组件/Grid 栅格布局",
    component: Row,
    argTypes: {},
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;
const commonClass = "h-8 w-full rounded-md ";
const rowClass = "bg-gray-100 py-2 rounded-md ";

export const Primary: Story = {
    // 需要视觉测试
    render() {
        return (
            <div>
                {/* 第一行至第二行的间距较小 */}
                <Row class={rowClass} bottomSpace={10}>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                    <Col span={12}>
                        <div class={`${commonClass} bg-gray-200`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                </Row>
                {/*  子无间距 */}
                <Row class={rowClass} justify="center" gutter={0}>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-200`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                </Row>
                <Row class={rowClass} justify="end">
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-200`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                </Row>
                <Row class={rowClass} justify="space-between">
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-200`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                </Row>
                <Row class={rowClass} justify="space-around">
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-200`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                </Row>
                <Row class={rowClass} justify="space-evenly">
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-200`} />
                    </Col>
                    <Col span={6}>
                        <div class={`${commonClass} bg-gray-300`} />
                    </Col>
                </Row>
            </div>
        );
    },
    args: {},
};
const getSelf = () => window.parent.document.querySelector("iframe")!;

const testSizeUnderWidth = async (canvas: any, spans: number[], width: number) => {
    const iframe = getSelf();
    if (!iframe) {
        console.error("识别 iframe 错误");
        return;
    }
    iframe.style.width = `${width}px`;
    await sleep(50);

    const widths = [...canvas.getByTestId("responsive").children].map((i) =>
        Math.ceil(Number.parseFloat(getComputedStyle(i).width)),
    );
    // 判断 widths 内数字的比例大约为 8:4:4:8
    expect(widths).toEqual(spans.map((i) => Math.round((width / 24) * i)));
};
export const Responsive: Story = {
    render() {
        return (
            <Row gutter={0} data-testid="responsive">
                <Col xs={8} sm={6} md={4} lg={3} xl={1} xxl={11}>
                    <div class={`${commonClass} bg-gray-300`} />
                </Col>
                <Col xs={4} sm={6} md={8} lg={9} xl={11} xxl={1}>
                    <div class={`${commonClass} bg-gray-200`} />
                </Col>
                <Col xs={4} sm={6} md={8} lg={9} xl={11} xxl={1}>
                    <div class={`${commonClass} bg-gray-300`} />
                </Col>
                <Col xs={8} sm={6} md={4} lg={3} xl={1} xxl={11}>
                    <div class={`${commonClass} bg-gray-200`} />
                </Col>
            </Row>
        );
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        document.body.style.padding = "0";

        await step("测试 xs 下的显示效果", async () => {
            await testSizeUnderWidth(canvas, [8, 4, 4, 8], 480);
        });

        await step("测试 sm 下的显示效果", async () => {
            await testSizeUnderWidth(canvas, [6, 6, 6, 6], 640);
        });

        await step("测试 md 下的显示效果", async () => {
            await testSizeUnderWidth(canvas, [4, 8, 8, 4], 768);
        });
        await step("测试 lg 下的显示效果", async () => {
            await testSizeUnderWidth(canvas, [3, 9, 9, 3], 1024);
        });

        await step("测试 xl 下的显示效果", async () => {
            await testSizeUnderWidth(canvas, [1, 11, 11, 1], 1296);
        });
        await step("测试 xxl 下的显示效果", async () => {
            await testSizeUnderWidth(canvas, [11, 1, 1, 11], 1536);
        });
        // 复原样式
        const iframe = getSelf();
        iframe.style.width = "inherit";
    },
};

// offset 视觉测试即可
export const Offset: Story = {
    render() {
        return (
            <>
                <Row>
                    <Col class="bg-primary-600 text-white" span={8}>
                        col-8
                    </Col>
                    <Col class="bg-primary-600 text-white" span={8} offset={8}>
                        col-8
                    </Col>
                </Row>
                <Row>
                    <Col class="bg-primary-600 text-white" span={6} offset={6}>
                        col-6 col-offset-6
                    </Col>
                    <Col class="bg-primary-600 text-white" span={6} offset={6}>
                        col-6 col-offset-6
                    </Col>
                </Row>
                <Row>
                    <Col class="bg-primary-600 text-white" span={12} offset={6}>
                        col-12 col-offset-6
                    </Col>
                </Row>
            </>
        );
    },
};

// Pull and Push 视觉测试即可
export const PullAndPush: Story = {
    render() {
        return (
            <>
                {/*  两个位置左右翻转 */}
                <Row>
                    <Col class="bg-primary-600 text-white" span={18} push={6}>
                        col-18 col-push-6
                    </Col>
                    <Col class="bg-primary-500 text-white" span={6} pull={18}>
                        col-6 col-pull-18
                    </Col>
                </Row>
            </>
        );
    },
};

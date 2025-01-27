import {
    type JSXSlot,
    OriginComponent,
    type OriginComponentInputType,
    OriginDiv,
    atom,
    ensureFunctionResult,
} from "@cn-ui/reactive";
import { Transition } from "solid-transition-group";
import { Col, Row } from "../RowAndCol";
import "../animation/fade.css";
import { Avatar } from "../avatar";
import { BaseInput } from "../input";
import { VirtualList, type VirtualListProps } from "../virtualList";

export interface ChatBoxMessage {
    id: string;
    avatar?: string;
    message: JSXSlot;
    position?: "right" | "left";
    create_at?: string;
}
export interface ChatBoxProps<T extends ChatBoxMessage>
    extends Pick<VirtualListProps<T>, "each" | "estimateSize"> {
    onSendMessage?: (text: string) => Promise<void>;
}

export const ChatBox = OriginComponent(
    <T extends ChatBoxMessage>(
        props: OriginComponentInputType<ChatBoxProps<T>, HTMLDivElement, T[]>,
    ) => {
        const userMessage = atom("");
        return (
            <OriginDiv prop={props} class="flex flex-col h-full ">
                <header class="h-16 bg-gray-100" />
                <VirtualList
                    reverse
                    each={props.each}
                    estimateSize={props.estimateSize}
                    getItemKey={(i) => props.each[i].id}
                >
                    {(item, _, { itemClass }) => {
                        itemClass("transition-all");
                        return (
                            <Transition name="cn-fade">
                                <Row bottomSpace={10}>
                                    <Col span={4}>
                                        {item.position !== "right" && (
                                            <Avatar src={item.avatar} fallback={<div>A</div>} />
                                        )}
                                    </Col>
                                    <Col span={16}>
                                        <p class="whitespace-pre-wrap bg-gray-100 p-2 rounded-md">
                                            {ensureFunctionResult(item.message)}
                                        </p>
                                    </Col>
                                    <Col span={4}>
                                        {item.position === "right" && (
                                            <Avatar src={item.avatar} fallback={<div>A</div>} />
                                        )}
                                    </Col>
                                </Row>
                            </Transition>
                        );
                    }}
                </VirtualList>
                <Row class="h-24 bg-gray-100" gutter={[4, 12]}>
                    <Col span={2} />
                    <Col span={20}>
                        <BaseInput
                            resize={false}
                            class="bg-design-card h-full w-full"
                            type="textarea"
                            v-model={userMessage}
                        />
                    </Col>
                    <Col span={2}>
                        <button
                            onclick={async () => {
                                await props.onSendMessage?.(userMessage());
                                userMessage("");
                            }}
                        >
                            提交
                        </button>
                    </Col>
                </Row>
            </OriginDiv>
        );
    },
);

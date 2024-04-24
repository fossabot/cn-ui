import { type Atom, type JSXSlot, atom } from "@cn-ui/reactive";
import { For } from "solid-js";
import { MODAL_LIST_POSITION, ModalList, type ModalListPosition } from "../Modal";
import { Alert, type AlertProps } from "./Alert";
import { createRuntimeArea } from "./runtime";

export interface MessageInfo extends Partial<AlertProps> {
    id?: string;
    title: JSXSlot;
    description?: JSXSlot;
    duration?: number;
    type: "info" | "success" | "error" | "warning";
    position?: ModalListPosition;
    closable?: boolean;
}

export class MessageControl {
    constructor(public id: string) {
        this.store = MODAL_LIST_POSITION.reduce(
            (col, i) => {
                col[i] = atom<MessageInfo[]>([]);
                return col;
            },
            {} as Record<ModalListPosition, Atom<MessageInfo[]>>,
        );
        createRuntimeArea(id, () => this.render({ store: this.store }));
    }
    public store: Record<ModalListPosition, Atom<MessageInfo[]>>;
    public removeMessage(id: string) {
        const pos = this.getPosFromId(id);
        return this.store[pos]((list) => list.filter((i) => i.id !== id));
    }
    private render(props: { store: MessageControl["store"] }) {
        return (
            <For each={MODAL_LIST_POSITION}>
                {(pos) => {
                    const listStore = props.store[pos];
                    return (
                        <ModalList
                            id={"cn-message-" + pos}
                            v-model={() => true}
                            each={listStore()}
                            by={(i) => i.id!}
                            position={pos}
                        >
                            {(item) => {
                                return (
                                    <Alert
                                        class="h-full bg-design-pure shadow-lg"
                                        type={item.type}
                                        round
                                        message={item.title}
                                        description={item.description}
                                        icon
                                        closable={item.closable}
                                        onClose={() => this.removeMessage(item.id!)}
                                    />
                                );
                            }}
                        </ModalList>
                    );
                }}
            </For>
        );
    }
    private autoKey = 1;
    getPosFromInfo(info: { position?: ModalListPosition }) {
        return info.position ?? "top";
    }
    getPosFromId(id: string) {
        return id.split(":", 1)[0] as ModalListPosition;
    }
    public create(message: JSXSlot, type: MessageInfo["type"], options: Partial<MessageInfo> = {}) {
        const pos = this.getPosFromInfo(options);
        const id = pos + ":" + (this.autoKey++).toString();

        const item: MessageInfo = { id, title: message, type, ...options };
        this.store[pos]((arr) => {
            return [item, ...arr];
        });
        this.durationClose(item, item.duration);
        return item;
    }
    close(item: MessageInfo) {
        if (item.id) this.removeMessage(item.id);
        throw new Error("需要输入一个 id 来关闭 Message");
    }
    private durationClose(item: MessageInfo, duration = 3000) {
        if (duration <= 0) {
            return;
        }
        setTimeout(() => {
            this.removeMessage(item.id!);
        }, duration);
    }
    public info(message: JSXSlot, options?: Partial<MessageInfo>) {
        return this.create(message, "info", options);
    }

    public success(message: JSXSlot, options?: Partial<MessageInfo>) {
        return this.create(message, "success", options);
    }

    public warning(message: JSXSlot, options?: Partial<MessageInfo>) {
        return this.create(message, "warning", options);
    }

    public error(message: JSXSlot, options?: Partial<MessageInfo>) {
        return this.create(message, "error", options);
    }
}
export const Message = /* @__PURE__ */ new MessageControl("cn-ui-message-layers");

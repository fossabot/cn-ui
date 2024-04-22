import { type JSXSlot } from "@cn-ui/reactive";
import { type SetStoreFunction, createStore, reconcile } from "solid-js/store";
import { Modal } from "../Modal/Modal";
import { Alert } from "./Alert";
import { createRuntimeArea } from "./runtime";

export interface MessageInfo {
    id?: string;
    title: JSXSlot;
    description?: JSXSlot;
    duration?: number;
    type: "info" | "success" | "error" | "warning";
    closable?: boolean;
}

export class MessageControl {
    constructor(public id: string) {
        const [store, setStore] = createStore<MessageInfo[]>([]);
        this.store = store;
        this.setStore = setStore;
        createRuntimeArea(id, () => this.render({ store, setStore }));
    }
    public store: MessageInfo[];
    public setStore: SetStoreFunction<MessageInfo[]>;
    public removeMessage(id: string) {
        return this.setStore(
            reconcile(
                this.store.filter((i) => i.id !== id),
                { key: "id" },
            ),
        );
    }
    private render(props: { store: MessageInfo[]; setStore: SetStoreFunction<MessageInfo[]> }) {
        return (
            <Modal v-model={() => true} each={props.store} by={(i) => i.id!} position="top">
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
            </Modal>
        );
    }
    private autoKey = 1;
    public create(message: JSXSlot, type: MessageInfo["type"], duration?: number) {
        const id = (this.autoKey++).toString();
        const item: MessageInfo = { id, title: message, type, duration, closable: true };
        this.setStore((arr) => {
            return [item, ...arr];
        });
        this.durationClose(item, duration);
        return item;
    }
    close(item: MessageInfo) {
        if (item.id) this.removeMessage(item.id);
        throw new Error("需要输入一个 id 来关闭 Message");
    }
    private durationClose(item: MessageInfo, duration = 0) {
        if (duration <= 0) {
            return;
        }
        setTimeout(() => {
            this.removeMessage(item.id!);
        }, duration);
    }
    public info(message: JSXSlot, duration?: number) {
        return this.create(message, "info", duration);
    }

    public success(message: JSXSlot, duration?: number) {
        return this.create(message, "success", duration);
    }

    public warning(message: JSXSlot, duration?: number) {
        return this.create(message, "warning", duration);
    }

    public error(message: JSXSlot, duration?: number) {
        return this.create(message, "error", duration);
    }
}
export const Message = /* @__PURE__ */ new MessageControl("cn-ui-message-layers");

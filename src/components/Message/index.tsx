import { Component, createSignal, For, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import { atom } from 'solid-use';
import { OuterSpaceRegister } from '../GlobalConfigStore/OuterSpace';
import { Icon } from '../Icon';
import { IconNames } from '../Icon/IconNames';
import { Position } from '../Mask/Position';
import { Space } from '../Space';
import { MessageProps } from './interface';
import './style/index.less';
/** 渲染存在的数据 */
const [MessageQueue, setMessage] = createStore<MessageProps[]>([]);

/** 渲染消息卡片 */
const MessageCard: Component<MessageProps> = (props) => {
    const close = () => setMessage((list) => list.filter((i) => i.id !== props.id));
    return (
        <div class="cn-message relative flex flex-row justify-evenly items-center px-4 py-3 leading-none border border-solid border-gray-200 rounded-lg bg-white overflow-hidden pointer-events-auto shadow-md text-center">
            <span>{props.icon}</span>
            <span>{props.content}</span>
            {props.closable && (
                <DefaultIcon name="close" color="gray" onclick={close}></DefaultIcon>
            )}
        </div>
    );
};
// 最小化动画载入
import 'animate.css/source/fading_entrances/fadeInDown.css';
import 'animate.css/source/fading_exits/fadeOutUp.css';
const Root = () => {
    return (
        <Position
            left="50%"
            top="10%"
            style={{
                transform: 'translate(-50%, -5%)',
                height: '100vh',
            }}
        >
            <Space
                transition={{
                    enterActiveClass: 'animated fadeInDown',
                    exitActiveClass: 'animated fadeOutUp',
                }}
                vertical
                className="animated"
                size="mini"
            >
                <For each={MessageQueue}>
                    {(props) => {
                        return <MessageCard {...props}></MessageCard>;
                    }}
                </For>
            </Space>
        </Position>
    );
};
OuterSpaceRegister({ slot: 'Inner', list: true, component: Root });

const sendMessage = (config: MessageProps, ...over: Partial<MessageProps>[]) => {
    config = Object.assign({}, ...over, config);
    // 1. 加入消息队列
    setMessage((items) => {
        const index = items.findIndex((i) => {
            return i.id === config.id;
        });
        return index === -1 ? [...items, config] : [...items.splice(index, 1, config)];
    });
    // 2. 添加删除信息

    const close = () => setMessage((list) => list.filter((i) => i.id !== config.id));
    console.log(config);
    if (config.duration > 0) {
        setTimeout(() => {
            close();
        }, config.duration);
    }
    return close;
};

const DefaultIcon: Component<
    JSX.HTMLAttributes<HTMLSpanElement> & { name: IconNames; color: string; spin?: boolean }
> = (props) => {
    return (
        <span
            class="cn-icon-wrapper h-5 w-5 inline-flex justify-center items-center rounded-full cursor-pointer"
            classList={{
                'bg-red-100 text-red-500': props.color === 'red',
                'bg-green-100 text-green-500': props.color === 'green',
                'bg-orange-100 text-orange-500': props.color === 'orange',
                'bg-gray-100 text-gray-500': props.color === 'gray',
                'bg-blue-100 text-blue-500': props.color === 'blue',
            }}
            {...props}
        >
            <Icon name={props.name} spin={props.spin}></Icon>
        </span>
    );
};
export class Message {
    static DefaultConfig: Partial<MessageProps> = {
        duration: 3000,
        closable: false,
    };
    static success(config: MessageProps) {
        return sendMessage(config, Message.DefaultConfig, {
            type: 'success',
            icon: () => DefaultIcon({ name: 'check', color: 'green' }),
        });
    }
    static loading(config: MessageProps) {
        return sendMessage(config, Message.DefaultConfig, {
            type: 'loading',
            icon: () => DefaultIcon({ name: 'refresh', color: 'gray', spin: true }),
        });
    }
    static info(config: MessageProps) {
        return sendMessage(config, Message.DefaultConfig, {
            type: 'info',
            icon: () => DefaultIcon({ name: 'info', color: 'blue' }),
        });
    }
    static warning(config: MessageProps) {
        return sendMessage(config, Message.DefaultConfig, {
            type: 'warning',
            icon: () => DefaultIcon({ name: 'warning_amber', color: 'orange' }),
        });
    }
    static error(config: MessageProps) {
        return sendMessage(config, Message.DefaultConfig, {
            type: 'error',
            icon: () => DefaultIcon({ name: 'error', color: 'red' }),
        });
    }
    static normal(config: MessageProps) {
        return sendMessage(config, Message.DefaultConfig, {
            type: 'normal',
        });
    }
}

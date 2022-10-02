import { Component, For, onCleanup, onMount } from 'solid-js';
import { atom } from '@cn-ui/use';
import { createTrigger } from '.';
import { Button } from '../Button';
import { Space } from '../Space';
export const Controller = [];
const sleep = (ms) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(null), ms);
    });
export default (props) => {
    const Comp: Component = () => {
        onMount(() => {
            console.log('初始化');
        });
        onCleanup(() => {
            console.log('被清理');
        });
        return (
            <Space>
                <div>Inner1</div>
                <div>Inner</div>
            </Space>
        );
    };
    const visible = atom(false);
    const disabled = atom(false);
    return (
        <Space>
            <Button
                ref={createTrigger({
                    content: Comp,
                    trigger: 'mouseenter click',
                    visible,
                    disabled,
                })}
            >
                hover
            </Button>
            <Button
                onClick={() => {
                    visible((i) => !i);
                }}
            >
                {visible() ? 'showing' : 'hiding'}
            </Button>
            <Button
                onClick={() => {
                    disabled((i) => !i);
                    console.log('点击');
                }}
            >
                {disabled() ? 'disabled' : 'enable'}
            </Button>
        </Space>
    );
};

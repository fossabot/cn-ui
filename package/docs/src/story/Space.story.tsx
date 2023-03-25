import { Animate } from '@cn-ui/animate';
import { Space } from '@cn-ui/core';
export const Controller = [
    {
        type: 'switch',
        default: false,
        prop: 'wrap',
    },
    {
        type: 'switch',
        default: false,
        prop: 'vertical',
    },

    {
        type: 'select',
        default: 'mini',
        prop: 'size',
        options: ['mini', 'small', 'medium', 'large'].map((i) => ({
            value: i,
        })),
    },
];

import '@cn-ui/animate/src/slide.css';
import { createSignal, For, onMount } from 'solid-js';
export default (props) => {
    const arr = (num) => [...Array(num).keys()];
    const [origin, setOrigin] = createSignal<number[]>(arr(10));

    return (
        <>
            <Space {...props}>
                {origin().map((i) => {
                    return <div style={{ width: '3rem', 'background-color': '#eee' }}>{i}</div>;
                })}
            </Space>

            <Space {...props}>
                <Animate directly group anime="slide" stagger={300} enterClass="hidden" appear>
                    <For each={origin()}>
                        {(i) => {
                            return (
                                <div style={{ width: '3rem', 'background-color': '#eee' }}>{i}</div>
                            );
                        }}
                    </For>
                </Animate>
            </Space>
        </>
    );
};
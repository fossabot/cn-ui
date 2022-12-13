import { Component, JSX, JSXElement, Match, Switch } from 'solid-js';
import { OriginComponent } from '@cn-ui/use';
type stringTag = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500' | 'loading';
interface ResultProps extends Omit<BoxProps, 'icon'> {
    icon: stringTag | JSX.FunctionElement | JSX.ArrayElement;
}
import { Box, BoxProps } from './Box';
import { DefaultIcon } from '@cn-ui/core';

const CompMap = new Map<stringTag, JSXElement>([
    [
        'success',
        () => (
            <DefaultIcon
                class="shadow-lg shadow-green-500/50"
                name="check_circle"
                color="green"
                size={50}
            ></DefaultIcon>
        ),
    ],
    [
        'error',
        () => (
            <DefaultIcon
                class="shadow-lg shadow-red-500/50"
                name="close"
                color="red"
                size={50}
            ></DefaultIcon>
        ),
    ],
    [
        'info',
        () => (
            <DefaultIcon
                class="shadow-lg shadow-blue-500/50"
                name="info"
                color="blue"
                size={50}
            ></DefaultIcon>
        ),
    ],
    [
        'warning',
        () => (
            <DefaultIcon
                class="shadow-lg shadow-orange-500/50"
                name="info"
                color="orange"
                size={50}
            ></DefaultIcon>
        ),
    ],
    [
        'loading',
        () => (
            <DefaultIcon
                class="shadow-lg shadow-gray-500/50"
                name="autorenew"
                color="gray"
                size={50}
                spin
            ></DefaultIcon>
        ),
    ],
]);
/**
 * @zh Result 是状态标识页面
 */
export const Result = OriginComponent<ResultProps, HTMLDivElement>((props) => {
    const IconComp = typeof props.icon === 'string' ? CompMap.get(props.icon) : props.icon;
    return <Box {...props} icon={IconComp}></Box>;
});

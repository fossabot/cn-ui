import { Component, createSignal, JSX, JSXElement, Match, mergeProps, Switch } from 'solid-js';
import { atom } from 'solid-use';
import { Icon } from '../Icon';
import { Box } from '../Box';
import './style/index.less';
export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type ImagePosition = 'center' | 'top' | 'right' | 'bottom' | 'left' | string;
export interface ImageProps extends JSX.HTMLAttributes<HTMLImageElement> {
    src: string;

    fit?: ImageFit;
    position?: ImagePosition;
    round?: boolean;
    block?: boolean;
    width?: number;
    height?: number;
    radius?: number;

    iconSize?: number | string;
    showError?: boolean;
    showLoading?: boolean;
    errorIcon?: JSXElement;
    loadingIcon?: JSXElement;
}

export const Image: Component<ImageProps> = (props) => {
    props = mergeProps(
        {
            alt: 'This is an Image',
            fit: 'cover',
            showError: true,
            showLoading: true,
            iconSize: '1.5em',
        },
        props
    );
    const error = atom(false);
    const loading = atom(true);
    return (
        <div
            class="cn-image"
            classList={{
                round: props.round,
                loading: loading(),
                error: error(),
            }}
            style={{
                display: props.block ? 'block' : 'inline-block',
                height: props.height + 'px',
                width: props.width + 'px',
            }}
        >
            <Switch>
                <Match when={props.showLoading && loading()}>
                    <Box
                        icon={<Icon name="refresh" spin size={props.iconSize}></Icon>}
                        description="加载中"
                    ></Box>
                </Match>
                <Match when={props.showError && error()}>
                    <Box
                        icon={<Icon name="error" size={props.iconSize}></Icon>}
                        description="图片加载错误"
                    ></Box>
                </Match>
            </Switch>

            {!error() && (
                <img
                    {...props}
                    src={props.src}
                    style={{
                        'object-fit': props.fit,
                        'object-position': props.position,
                    }}
                    onLoad={() => loading(false)}
                    onError={() => {
                        loading(false);
                        error(true);
                    }}
                />
            )}
        </div>
    );
};
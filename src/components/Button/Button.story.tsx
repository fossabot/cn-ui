import { Button } from './index';
export const Controller = [
    {
        type: 'switch',
        default: false,
        prop: 'disabled',
    },
    {
        type: 'switch',
        default: false,
        prop: 'iconOnly',
    },
    {
        type: 'switch',
        default: false,
        prop: 'loading',
    },
    {
        type: 'switch',
        default: false,
        prop: 'loadingFixedWidth',
    },
    {
        type: 'select',
        default: 'square',
        prop: 'shape',
        options: ['circle', 'round', 'square'].map((i) => ({ value: i })),
    },
    {
        type: 'select',
        default: 'default',
        prop: 'size',
        options: ['mini', 'small', 'default', 'large'].map((i) => ({ value: i })),
    },
    {
        type: 'select',
        default: 'default',
        prop: 'type',
        options: ['default', 'primary', 'secondary', 'dashed', 'text', 'outline'].map((i) => ({
            value: i,
        })),
    },
];
export default (props) => {
    return (
        <>
            <Button {...props}>按钮一个</Button>
            <br />
            <Button {...props} long>
                按钮一个
            </Button>
        </>
    );
};

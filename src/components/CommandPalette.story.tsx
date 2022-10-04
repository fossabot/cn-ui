import { CommandPalette, Root, Action, defineAction } from '@cn-ui/command-palette/src/lib/index';
import { useStore } from '@cn-ui/command-palette/src/lib/StoreContext';
import { atom, reflect } from '@cn-ui/use';
import { onMount } from 'solid-js';
import { Button } from './Button';
import { CheckBox } from './Form/CheckBox';
import { CheckGroup } from './Form/CheckGroupData';
import { Image } from './Image';
import { Message } from './Message';
export const Controller = [];

const initActions = [
    {
        id: 'message-info',
        title: '发出提示',
        subtitle: 'fjiefjeijeif',
        keywords: ['Message'],

        icon: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
        run() {
            Message.info('来自 Command Palette');
        },
    },
    {
        id: 'command',
        title: '关闭',
        subtitle: '反对反对的',
        keywords: ['command'],
        run() {
            Message.info('关闭');
        },
    },
];

export default (props) => {
    const actionSource = atom<any>(initActions);
    const actions = reflect<Action[]>(() => actionSource().map((i) => defineAction(i)));
    const visible = atom(true);

    onMount(() => {
        // I want to add some actions after mount!
        actionSource((i) => [
            ...i,
            {
                id: 'hide',
                title: 'Toggle Message KeyWords',
                subtitle: 'Click Me',
                keywords: ['Message'],
                run() {
                    selectingKeyWords((i) => (i === 'Message' ? '' : 'Message'));
                    return true;
                },
            },
        ]);
    });

    const selectingKeyWords = atom('');

    /** static Filter Function */
    const keywordsFilter = (action) => {
        /** But use reactive Object! Every search will be auto update! */
        if (selectingKeyWords()) {
            return action.keywords.includes(selectingKeyWords());
        } else {
            return true;
        }
    };
    return (
        <div>
            <Root
                filters={[keywordsFilter]}
                visibility={visible}
                actions={actions}
                actionsContext={{}}
                components={{
                    ResultIcon({ action }) {
                        return (
                            <Image
                                src={(action as any).icon}
                                class="h-10 w-10 rounded-lg overflow-hidden mr-4"
                            ></Image>
                        );
                    },
                }}
            >
                <CommandPalette></CommandPalette>
            </Root>
            <Button onClick={() => visible((i) => !i)}>{visible() ? '打开' : '关闭'}</Button>
        </div>
    );
};
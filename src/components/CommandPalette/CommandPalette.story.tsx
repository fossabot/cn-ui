import { CommandPalette, Root, Action, defineAction } from '@cn-ui/command-palette/src/lib/index';
import { atom, reflect } from '@cn-ui/use';
import { onMount } from 'solid-js';
import { useKeyWordsFilter } from './index';
import { Button } from '../Button';
import { CheckGroupController } from '../Form/CheckGroupController';
import { CheckGroup } from '../Form/CheckGroupData';
import { Image } from '../Image';
import { Message } from '../Message';
import { Space } from '../Space';
export const Controller = [];

const initActions = [
    {
        id: 'message-info',
        title: '发出提示',
        subtitle: 'fjiefjeijeif',
        keywords: ['Message', 'web detection', 'another'],
        icon: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
        run() {
            Message.info('来自 Command Palette');
        },
    },
    {
        id: 'command',
        title: '关闭',
        subtitle: '反对反对的',
        keywords: ['command', 'it is awesome'],
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
                    return true;
                },
            },
        ]);
    });

    // Helpful filter automatically generated by actions!

    const { keywordsFilter, keywords } = useKeyWordsFilter(actions);
    return (
        <div>
            <Root
                filters={[keywordsFilter]}
                visibility={visible}
                actions={actions}
                actionsContext={{}}
                components={{
                    // define the Icon on the left of every
                    ResultIcon({ action }) {
                        return (
                            <Image
                                src={(action as any).icon}
                                class="h-10 w-10 rounded-lg overflow-hidden mr-4"
                            ></Image>
                        );
                    },
                    // It will add a Tag Select Bar between search box and result list
                    Main() {
                        return (
                            <Space>
                                <CheckGroupController class="flex-none" data={keywords}>
                                    All
                                </CheckGroupController>
                                <div class="flex-1 overflow-auto">
                                    <CheckGroup data={keywords}></CheckGroup>
                                </div>
                            </Space>
                        );
                    },
                }}
            >
                <CommandPalette></CommandPalette>
            </Root>
            {/* Control the reactive visible easier */}
            <Button onClick={() => visible((i) => !i)}>{visible() ? '打开' : '关闭'}</Button>
        </div>
    );
};
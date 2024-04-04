import type { Meta, StoryObj } from 'storybook-solidjs'

import { CascaderPanel, Cascader } from './index'
import { CommonGroupListConfig } from '../groupList'
import { JSONViewer } from '../dataViewer/index'
import { atom } from '@cn-ui/reactive'

const meta = {
    title: 'Data 数据展示/Cascader 级联选择',
    component: CascaderPanel,
    argTypes: {}
} satisfies Meta<typeof CascaderPanel>

export default meta
type Story = StoryObj<typeof meta>

const options = [
    {
        value: 'jack',
        label: 'Jack'
    },
    {
        value: 'lucy',
        label: 'Lucy',
        withSeparate: true
    },
    {
        value: 'tom',
        label: 'Tom',
        options: [
            {
                value: 'tom',
                label: 'Tom1',
                options: [
                    {
                        value: 'jack',
                        label: 'Jack'
                    },
                    {
                        value: 'lucy',
                        label: 'Lucy',
                        withSeparate: true
                    },
                    {
                        value: 'tom',
                        label: 'Tom2'
                    },
                    {
                        value: 'tom',
                        label: 'Tom3'
                    }
                ]
            },
            {
                value: 'tom',
                label: 'Tom2'
            },
            {
                value: 'tom',
                label: 'Tom3'
            }
        ]
    }
] as CommonGroupListConfig[]

export const Fold: Story = {
    name: 'CascaderPanel 分组列表',
    render() {
        const selected = atom([])
        return (
            <div class="flex gap-4 flex-col">
                <JSONViewer data={selected()}></JSONViewer>
                <CascaderPanel options={options} v-model={selected}></CascaderPanel>
            </div>
        )
    },
    args: {}
}
export const Casca: Story = {
    name: 'Cascader 分组列表',
    render() {
        const selected = atom([])
        return (
            <div class="flex gap-4 flex-col">
                <JSONViewer data={selected()}></JSONViewer>
                <Cascader options={options} v-model={selected}></Cascader>
            </div>
        )
    },
    args: {}
}

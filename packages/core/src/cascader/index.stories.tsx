import type { Meta, StoryObj } from 'storybook-solidjs'

import { CascaderPanel } from './index'
import { CommonGroupListConfig } from '../groupList'

const meta = {
    title: 'Data 数据展示/Cascader 级联选择',
    component: CascaderPanel,
    argTypes: {}
} satisfies Meta<typeof CascaderPanel>

export default meta
type Story = StoryObj<typeof meta>
export const Fold: Story = {
    name: 'CascaderPanel 分组列表',
    render() {
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
        return (
            <div class="flex gap-4">
                <CascaderPanel
                    trigger="hover"
                    options={options}
                    open={(item) => {
                        return item.level! <= 2
                    }}
                ></CascaderPanel>
            </div>
        )
    },
    args: {}
}

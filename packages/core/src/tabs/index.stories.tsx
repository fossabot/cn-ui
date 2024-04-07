import type { Meta, StoryObj } from 'storybook-solidjs'

import { Tabs } from './index'
import { defineExampleAC } from '../lazyLoad/example/defineExampleAC'
import Mock from 'mockjs-ts'
import { SelectOptionsType } from '@cn-ui/reactive'

const meta = {
    title: 'Navigation 导航/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    argTypes: {}
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

defineExampleAC()

/**  */
export const Primary: Story = {
    render() {
        const options = Mock.mock<{ data: SelectOptionsType[] }>({ 'data|5': [{ label: '@cname', value: '@name' }] }).data
        return <Tabs options={options}></Tabs>
    },
    args: {}
}

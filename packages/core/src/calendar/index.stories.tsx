import type { Meta, StoryObj } from 'storybook-solidjs'

import { Calendar } from './index'
import { atom } from '@cn-ui/reactive'
import dayjs from 'dayjs'
import { Flex } from '../container'

const meta = {
    title: 'Controls/Calendar 日历',
    component: Calendar,
    argTypes: {}
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    name: '日历面板',
    render() {
        const date = atom([dayjs()])
        return (
            <Flex gap="20px">
                <Calendar v-model={date}></Calendar>
                <Calendar v-model={date} mode="multiple"></Calendar>
                <Calendar v-model={date} mode="range"></Calendar>
            </Flex>
        )
    },
    args: {}
}
export const Second: Story = {
    name: '月份面板',
    render() {
        const date = atom([dayjs()])
        return (
            <Flex gap="20px">
                <Calendar v-model={date} type="month"></Calendar>
                <Calendar v-model={date} type="month" mode="multiple"></Calendar>
                <Calendar v-model={date} type="month" mode="range"></Calendar>
            </Flex>
        )
    },
    args: {}
}

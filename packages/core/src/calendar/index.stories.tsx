import type { Meta, StoryObj } from 'storybook-solidjs'

import { Calendar } from './index'
import { atom } from '@cn-ui/reactive'
import dayjs, { Dayjs } from 'dayjs'

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
        const date = atom(dayjs())
        return (
            <>
                <Calendar v-model={date}></Calendar>
            </>
        )
    },
    args: {}
}

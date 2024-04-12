import { For } from 'solid-js'
import { CalenderCtx } from '../Calendar'
import { debounce } from 'lodash-es'
import dayjs, { Dayjs } from 'dayjs'
import { CalendarMonthCell } from './DefaultCalendarCell'

export const MonthCalenderPanel = (props: {}) => {
    const calendarSystem = CalenderCtx.use()
    return (
        <div class="grid grid-cols-3">
            <For each={calendarSystem.monthHeader()}>
                {(_month, index) => {
                    const date = dayjs().month(index())
                    return (
                        <div
                            class="p-2"
                            onmouseover={debounce(() => {
                                if (calendarSystem.isSelectingEnd()) calendarSystem.virtualEndTime(date)
                            }, 100)}
                            onclick={() => {
                                !calendarSystem.isInMonth(date) && calendarSystem.targetDate((i) => i.set('month', date.month()))
                                calendarSystem.toggleSelect(date)
                            }}
                        >
                            <CalendarMonthCell date={date}></CalendarMonthCell>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

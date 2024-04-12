import { For, createMemo } from 'solid-js'
import { CalenderCtx } from '../Calendar'
import { debounce } from 'lodash-es'
import dayjs, { Dayjs } from 'dayjs'
import { CalendarMonthCell, CalendarYearCell } from './DefaultCalendarCell'
import { computed, genArray } from '@cn-ui/reactive'

export const MonthCalenderPanel = (props: {}) => {
    const calendarSystem = CalenderCtx.use()
    const isMonthView = createMemo(() => calendarSystem.calendarUnit() === 'month')
    return (
        <div class="grid grid-cols-3">
            <For each={calendarSystem.monthHeader()}>
                {(_month, index) => {
                    const date = dayjs().month(index())
                    return (
                        <div
                            class="p-2"
                            onmouseover={debounce(() => {
                                if (isMonthView() && calendarSystem.isSelectingEnd()) calendarSystem.virtualEndTime(date)
                            }, 100)}
                            onclick={() => {
                                if (isMonthView()) {
                                    !calendarSystem.isInMonth(date) && calendarSystem.targetDate((i) => i.set('month', date.month()))
                                    calendarSystem.toggleSelect(date)
                                } else {
                                    calendarSystem.calendarShowingType('day')
                                    calendarSystem.targetDate((i) => i.set('month', date.month()))
                                }
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
export const YearCalenderPanel = (props: {}) => {
    const calendarSystem = CalenderCtx.use()
    const yearList = createMemo(() => {
        const start = calendarSystem.targetDate().add(-4, 'y')
        return genArray(12).map((i) => {
            return start.add(i, 'y')
        })
    })
    const isYearView = createMemo(() => calendarSystem.calendarUnit() === 'year')
    return (
        <div class="grid grid-cols-3">
            <For each={yearList()}>
                {(date, index) => {
                    return (
                        <div
                            class="p-2"
                            onmouseover={debounce(() => {
                                if (isYearView() && calendarSystem.isSelectingEnd()) calendarSystem.virtualEndTime(date)
                            }, 100)}
                            onclick={() => {
                                if (isYearView()) {
                                    !calendarSystem.isInMonth(date) && calendarSystem.targetDate((i) => i.set('year', date.year()))
                                    calendarSystem.toggleSelect(date)
                                } else {
                                    calendarSystem.calendarShowingType('month')
                                    calendarSystem.targetDate((i) => i.set('year', date.year()))
                                }
                            }}
                        >
                            <CalendarYearCell date={date} year={date.year()}></CalendarYearCell>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

import { classNames, ensureFunctionResult, firstClass, genArray } from '@cn-ui/reactive'
import { debounce } from 'lodash-es'
import { For, createMemo } from 'solid-js'
import { CalendarDateCell } from './DefaultCalendarCell'
import { CalendarProps, CalenderCtx } from '../Calendar'

export const DateCalendarPanel = (props: { Cell?: CalendarProps['Cell'] }) => {
    const calendarSystem = CalenderCtx.use()

    const dateGrid = createMemo(() => {
        const dates = calendarSystem.allDateInMonth()
        return [...calendarSystem.extraStartWeek(), ...dates.paddingStart, ...dates.dayInMonth, ...dates.paddingEnd, ...calendarSystem.extraEndWeek()]
    })
    return (
        <div class="text-center">
            <div class="grid grid-cols-7  text-xs py-2">
                <For each={calendarSystem.weekHeader()}>
                    {(date) => {
                        return <div class={classNames('p-2')}>{date}</div>
                    }}
                </For>
            </div>
            <div class="grid grid-cols-7">
                <For each={dateGrid()}>
                    {(date) => {
                        return (
                            <div
                                class={firstClass.base('p-0')(!calendarSystem.isInMonth(date) && 'opacity-50', '')}
                                onmouseover={debounce(() => {
                                    if (calendarSystem.isSelectingEnd()) calendarSystem.virtualEndTime(date)
                                }, 100)}
                                onclick={() => {
                                    !calendarSystem.isInMonth(date) && calendarSystem.targetDate((i) => i.set('month', date.month()))
                                    calendarSystem.toggleSelect(date)
                                }}
                            >
                                {ensureFunctionResult(props.Cell ?? CalendarDateCell, [{ date, model: calendarSystem.selectedDate }])}
                            </div>
                        )
                    }}
                </For>
            </div>
        </div>
    )
}

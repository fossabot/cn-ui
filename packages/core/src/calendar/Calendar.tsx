import {
    Atom,
    DateCalendarConfig,
    JSXSlot,
    OriginComponent,
    atom,
    classNames,
    createCtx,
    ensureFunctionResult,
    useCalendarSelect,
    useDateCalendar
} from '@cn-ui/reactive'
import { Dayjs } from 'dayjs'
import { chunk } from 'lodash-es'
import { For, createMemo } from 'solid-js'
import { Icon } from '../icon'
import { AiOutlineDoubleLeft, AiOutlineLeft } from 'solid-icons/ai'

export interface CalendarProps {
    Cell?: JSXSlot<{
        date: Dayjs
        model: Atom<Dayjs>
    }>
    mode?: 'single' | 'multiple' | 'range'
}

const CalenderCtx = createCtx<ReturnType<typeof useCalendarSelect>>()

export const Calendar = OriginComponent<CalendarProps, HTMLTableElement, Dayjs>((props) => {
    const calendarText = createMemo(() => props.model().format('YYYY MM'))
    const selected = atom<Dayjs[]>([])
    const select = useCalendarSelect(selected, { mode: () => props.mode })
    return (
        <CalenderCtx.Provider value={select}>
            <div class="flex flex-col select-none">
                <CalendarHeader {...props} calendarText={calendarText()}></CalendarHeader>
                <DateCalendarPanel model={props.model} config={{ startOfWeek: 1, extraEndWeek: 2 }} Cell={props.Cell}></DateCalendarPanel>
            </div>
        </CalenderCtx.Provider>
    )
})
export const DateCalendarPanel = (props: {
    model: Atom<Dayjs>
    config: DateCalendarConfig
    Cell?: JSXSlot<{
        date: Dayjs
        model: Atom<Dayjs>
    }>
}) => {
    const selectSystem = CalenderCtx.use()
    const calendarSystem = useDateCalendar(props.model, () => props.config)
    const dateGrid = createMemo(() => {
        const dates = calendarSystem.allDateInMonth()
        return chunk([...calendarSystem.extraStartWeek(), ...dates.paddingStart, ...dates.dayInMonth, ...dates.paddingEnd, ...calendarSystem.extraEndWeek()], 7)
    })
    return (
        <table class="table-auto text-center">
            <thead>
                <tr>
                    <For each={calendarSystem.weekHeader()}>
                        {(date) => {
                            return <td class={classNames('px-2')}>{date}</td>
                        }}
                    </For>
                </tr>
            </thead>
            <tbody>
                <For each={dateGrid()}>
                    {(item) => {
                        return (
                            <tr>
                                <For each={item}>
                                    {(date) => {
                                        return (
                                            <td
                                                class={classNames(!calendarSystem.isInMonth(date) && 'opacity-50')}
                                                onclick={() => {
                                                    !calendarSystem.isInMonth(date) && props.model((i) => i.set('month', date.month()))
                                                }}
                                            >
                                                {ensureFunctionResult(props.Cell ?? DefaultCalendarCell, [{ date, model: props.model }])}
                                            </td>
                                        )
                                    }}
                                </For>
                            </tr>
                        )
                    }}
                </For>
            </tbody>
        </table>
    )
}

export const DefaultCalendarCell = (props: { date: Dayjs }) => {
    return <div>{props.date.date()}</div>
}

function CalendarHeader(props: { calendarText: string; model: Atom<Dayjs> }) {
    const iconClass = 'transition-colors cursor-pointer text-design-h2 hover:text-design-text'
    return (
        <div class="flex  ">
            <Icon onclick={() => props.model((i) => i.add(-1, 'year'))} class={iconClass}>
                <AiOutlineDoubleLeft></AiOutlineDoubleLeft>
            </Icon>
            <Icon class={iconClass} onclick={() => props.model((i) => i.add(-1, 'month'))}>
                <AiOutlineLeft></AiOutlineLeft>
            </Icon>
            <div class="flex-1 text-center">{props.calendarText}</div>

            <Icon class={iconClass + ' rotate-180'} onclick={() => props.model((i) => i.add(1, 'month'))}>
                <AiOutlineLeft></AiOutlineLeft>
            </Icon>
            <Icon onclick={() => props.model((i) => i.add(1, 'year'))} class={iconClass + ' rotate-180'}>
                <AiOutlineDoubleLeft></AiOutlineDoubleLeft>
            </Icon>
        </div>
    )
}

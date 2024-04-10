import {
    Atom,
    DateCalendarConfig,
    JSXSlot,
    OriginComponent,
    atom,
    classNames,
    createCtx,
    ensureFunctionResult,
    firstClass,
    useCalendarSelect,
    useDateCalendar
} from '@cn-ui/reactive'
import { Dayjs } from 'dayjs'
import { debounce } from 'lodash-es'
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
    const select = useCalendarSelect(selected, { mode: () => props.mode ?? 'single' })
    return (
        <CalenderCtx.Provider value={select}>
            <div class="flex flex-col select-none w-fit">
                <CalendarHeader {...props} calendarText={calendarText()}></CalendarHeader>
                <DateCalendarPanel model={props.model} config={{ startOfWeek: 0 }} Cell={props.Cell}></DateCalendarPanel>
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
        return [...calendarSystem.extraStartWeek(), ...dates.paddingStart, ...dates.dayInMonth, ...dates.paddingEnd, ...calendarSystem.extraEndWeek()]
    })
    return (
        <div class="text-center">
            <div class="grid grid-cols-7">
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
                                    if (selectSystem.isSelectingEnd()) selectSystem.virtualEndTime(date)
                                }, 100)}
                                onclick={() => {
                                    !calendarSystem.isInMonth(date) && props.model((i) => i.set('month', date.month()))
                                    selectSystem.toggleSelect(date)
                                }}
                            >
                                {ensureFunctionResult(props.Cell ?? DefaultCalendarCell, [{ date, model: props.model }])}
                            </div>
                        )
                    }}
                </For>
            </div>
        </div>
    )
}

export const DefaultCalendarCell = (props: { date: Dayjs }) => {
    const selectSystem = CalenderCtx.use()
    const edgeDateClass = 'bg-primary-50 text-primary-300 hover:text-primary-600  bg-primary-50 text-primary-300 hover:text-primary-600 '
    return (
        <div
            class={firstClass.base(
                'transition-colors cursor-pointer  w-8 h-8 flex justify-center items-center',
                selectSystem.mode() !== 'range' && 'rounded-md'
            )(
                selectSystem.isStartDate(props.date) && edgeDateClass + 'rounded-md',
                selectSystem.isEndDate(props.date) && edgeDateClass + 'rounded-r-md',
                selectSystem.isSelected(props.date) && 'bg-primary-50 text-primary-300 hover:text-primary-600',
                'hover:bg-gray-100 rounded-md'
            )}
        >
            <div
                data-i={selectSystem.isEndDate(props.date)}
                data-ii={props.date.format('YYYY MM DD ')}
                class={firstClass.base('')(
                    (selectSystem.isEndDate(props.date) || selectSystem.isStartDate(props.date)) && ' w-6 h-6 rounded-full  bg-primary-600 text-design-pure'
                )}
            >
                {props.date.date()}
            </div>
        </div>
    )
}

function CalendarHeader(props: { calendarText: string; model: Atom<Dayjs> }) {
    const iconClass = 'transition-colors cursor-pointer text-design-h2 hover:text-design-text'
    return (
        <div class="flex  py-2 border-b">
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

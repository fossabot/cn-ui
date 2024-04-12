import { Icon } from '../../icon'
import { AiOutlineDoubleLeft, AiOutlineLeft } from 'solid-icons/ai'
import { CalenderCtx } from '../Calendar'
import { Show, createMemo } from 'solid-js'

export function CalendarHeader() {
    const calendarSystem = CalenderCtx.use()
    const iconClass = 'transition-colors cursor-pointer text-design-h2 hover:text-design-text'
    return (
        <div class="flex  py-2 border-b gap-1">
            <Icon onclick={() => calendarSystem.targetDate((i) => i.add(-1, 'year'))} class={iconClass}>
                <AiOutlineDoubleLeft></AiOutlineDoubleLeft>
            </Icon>
            <Icon class={iconClass} onclick={() => calendarSystem.targetDate((i) => i.add(-1, 'month'))}>
                <AiOutlineLeft></AiOutlineLeft>
            </Icon>
            <div class="flex-1 text-center">
                <Show
                    when={calendarSystem.mode() === 'range'}
                    fallback={
                        <>
                            <span onclick={() => calendarSystem.calendarShowingType('year')}>{calendarSystem.targetDate().year()}</span>
                            {calendarSystem.calendarShowingType() !== 'year' && (
                                <span onclick={() => calendarSystem.calendarShowingType('month')}>{calendarSystem.targetDate().month() + 1}</span>
                            )}
                        </>
                    }
                >
                    {calendarSystem
                        .selectedDate()
                        .map((i) => i.format('YYYY MM'))
                        .join(' - ')}
                </Show>
            </div>

            <Icon class={iconClass + ' rotate-180'} onclick={() => calendarSystem.targetDate((i) => i.add(1, 'month'))}>
                <AiOutlineLeft></AiOutlineLeft>
            </Icon>
            <Icon onclick={() => calendarSystem.targetDate((i) => i.add(1, 'year'))} class={iconClass + ' rotate-180'}>
                <AiOutlineDoubleLeft></AiOutlineDoubleLeft>
            </Icon>
        </div>
    )
}

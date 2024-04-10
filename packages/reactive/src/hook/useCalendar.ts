import dayjs, { Dayjs } from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { Accessor, createMemo } from 'solid-js'
import { genArray } from '../utils'
import { Atom, atom } from '../atom'
dayjs.extend(minMax)

export const useCalendar = () => {
    return
}

export const useCalendarSelect = (
    model: Atom<Dayjs[]>,
    config: {
        /**
         * The selection mode of the calendar.
         * - `single` - only one date can be selected
         * - `multiple` - multiple dates can be selected
         * - `range` - a range of dates can be selected
         */
        mode?: () => 'single' | 'multiple' | 'range' | undefined
    }
) => {
    const selectedDate = model
    const mode = createMemo(() => config.mode?.() ?? 'single')
    const isSelected = (d: Dayjs) => {
        if (['single', 'multiple'].includes(mode())) {
            return selectedDate().some((i) => d.isSame(i))
        } else {
            return d.isAfter(selectedDate()[0]) && d.isBefore(selectedDate()[1])
        }
    }
    return {
        selectedDate,
        mode,
        isSelected,
        isStartDate(d: Dayjs) {
            return d.isSame(selectedDate()[0])
        },
        isEndDate(d: Dayjs) {
            return d.isSame(selectedDate()[1])
        },
        toggleSelect(d: Dayjs, state = isSelected(d)) {
            switch (mode()) {
                case 'single':
                    return state ? selectedDate([d]) : selectedDate([])
                case 'multiple':
                    return state ? selectedDate((i) => [...i, d]) : selectedDate((i) => i.filter((selected) => !d.isSame(selected)))
                case 'range':
                    return state
                        ? selectedDate((i) => {
                              const max = dayjs.max(...i, d)!
                              const min = dayjs.min(...i, d)!
                              return [min, max]
                          })
                        : selectedDate((i) => i.filter((selected) => !d.isSame(selected)))
            }
        }
    }
}

export interface DateCalendarConfig {
    /** 日历中一周的第一天是星期几 */
    startOfWeek?: number
    extraStartWeek?: number
    extraEndWeek?: number
}

/** 经典日期日历 */
export const useDateCalendar = (targetDate: Accessor<Dayjs>, config: Accessor<DateCalendarConfig>) => {
    const allDateInMonth = createMemo(() => {
        const firstDateOfMonth = targetDate().startOf('month')
        const lastDateOfMonth = targetDate().endOf('month')

        const firstDateOfCalendar = firstDateOfMonth.day(config().startOfWeek ?? 0)
        const lastDateOfCalendar = lastDateOfMonth.add(7 - (lastDateOfMonth.day() - (config().startOfWeek ?? 0) + 1), 'd')
        return {
            firstDateOfCalendar,
            lastDateOfCalendar,
            firstDateOfMonth,
            lastDateOfMonth,
            dayInMonth: getDaysInRange(firstDateOfMonth, lastDateOfMonth),
            paddingStart: getDaysInRange(firstDateOfCalendar, firstDateOfMonth.add(-1, 'd')),
            paddingEnd: getDaysInRange(lastDateOfMonth.add(1, 'd'), lastDateOfCalendar)
        }
    })
    const extraStartWeek = createMemo(() => {
        const num = config().extraStartWeek
        if (num && num >= 0) {
            const start = allDateInMonth().firstDateOfCalendar
            return getDaysInRange(start.add(-num!, 'w'), start.add(-1, 'd'))
        } else {
            return []
        }
    })
    const extraEndWeek = createMemo(() => {
        const num = config().extraEndWeek
        if (num && num >= 0) {
            const end = allDateInMonth().lastDateOfCalendar
            return getDaysInRange(end.add(1, 'd'), end.add(num!, 'w'))
        } else {
            return []
        }
    })
    return {
        targetDate,
        allDateInMonth,
        extraStartWeek,
        extraEndWeek,
        weekHeader(locales?: string) {
            const names = WeekTitleLocale(locales, { weekday: 'short' })
            return genArray(7)
                .map((i) => ((config().startOfWeek ?? 0) + i) % 7)
                .map((i) => names[i])
        },
        isInMonth(date: Dayjs) {
            return date.isSame(targetDate(), 'month')
        }
    }
}

export const WeekTitleLocale = (locales?: string, options?: Intl.DateTimeFormatOptions) => {
    const weekdays = genArray(7)
    const today = dayjs()
    const formatter = new Intl.DateTimeFormat(locales, options)

    return weekdays.map((index) => {
        const date = today.day(index)
        return formatter.format(date.toDate())
    })
}

/** 日期区间选中，这个包含左右两端 */
export const getDaysInRange = (startDate: Dayjs, endDate: Dayjs) => {
    if (endDate < startDate) {
        console.warn('getDaysInRange end > start')
        return []
    }
    const days = []
    let currentDate = startDate
    while (currentDate <= endDate) {
        days.push(currentDate)
        currentDate = currentDate.add(1, 'day')
    }
    return days
}

import {
    type Atom,
    type DateCalendarConfig,
    type JSXSlot,
    OriginComponent,
    atom,
    computed,
    createCtx,
    useCalendarSelect,
    useDateCalendar,
} from "@cn-ui/reactive";
import dayjs, { type Dayjs } from "dayjs";
import { Match, Switch, createMemo, untrack } from "solid-js";
import { CalendarHeader } from "./components/CalendarHeader";
import { DateCalendarPanel } from "./components/DateCalendarPanel";
import { MonthCalenderPanel } from "./components/MonthCalenderPanel";
import { YearCalenderPanel } from "./components/YearCalenderPanel";

export interface CalendarProps extends DateCalendarConfig {
    Cell?: JSXSlot<{
        date: Dayjs;
        model: Atom<Dayjs[]>;
    }>;
    mode?: "single" | "multiple" | "range";
    type?: "year" | "month" | "day";
}

export const CalenderCtx = createCtx<
    {
        calendarShowingType: Atom<NonNullable<CalendarProps["type"]>>;
    } & ReturnType<typeof useCalendarSelect> &
        ReturnType<typeof useDateCalendar>
>();

export const Calendar = OriginComponent<CalendarProps, HTMLTableElement, Dayjs[]>((props) => {
    const selected = props.model;
    /** 目标选择的时候使用的 */
    const calendarType = createMemo(() => props.type ?? "day");
    /** 展示的时候使用 */
    const calendarShowingType = computed(() => untrack(calendarType) ?? "day");
    const select = useCalendarSelect(selected, {
        mode: () => props.mode ?? "single",
        unit: calendarType,
    });
    const watchingDate = atom(props.model()[0] ?? dayjs());
    const calendarSystem = useDateCalendar(watchingDate, () => props);
    return (
        <CalenderCtx.Provider value={{ ...select, ...calendarSystem, calendarShowingType }}>
            <div class="flex flex-col select-none w-fit min-w-[15rem]">
                <CalendarHeader />
                <Switch>
                    <Match when={calendarShowingType() === "year"}>
                        <YearCalenderPanel />
                    </Match>
                    <Match when={calendarShowingType() === "month"}>
                        <MonthCalenderPanel />
                    </Match>
                    <Match when={calendarShowingType() === "day"}>
                        <DateCalendarPanel Cell={props.Cell} />
                    </Match>
                </Switch>
            </div>
        </CalenderCtx.Provider>
    );
});

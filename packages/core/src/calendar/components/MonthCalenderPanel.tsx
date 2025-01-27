import { debounce } from "radash";
import { For, createMemo } from "solid-js";
import { CalenderCtx } from "../Calendar";
import { CalendarMonthCell } from "./DefaultCalendarCell";

export const MonthCalenderPanel = () => {
    const calendarSystem = CalenderCtx.use();
    const isMonthView = createMemo(() => calendarSystem.calendarUnit() === "month");
    return (
        <div class="grid grid-cols-3">
            <For each={calendarSystem.monthHeader()}>
                {(_month, index) => {
                    const date = calendarSystem.targetDate().month(index());
                    return (
                        <div
                            class="p-2"
                            onmouseover={debounce({ delay: 100 }, () => {
                                if (isMonthView() && calendarSystem.isSelectingEnd())
                                    calendarSystem.virtualEndTime(date);
                            })}
                            onclick={() => {
                                if (isMonthView()) {
                                    !calendarSystem.isInMonth(date) &&
                                        calendarSystem.targetDate((i) =>
                                            i.set("month", date.month()),
                                        );
                                    calendarSystem.toggleSelect(date);
                                } else {
                                    calendarSystem.calendarShowingType("day");
                                    calendarSystem.targetDate((i) => i.set("month", date.month()));
                                }
                            }}
                        >
                            <CalendarMonthCell date={date} />
                        </div>
                    );
                }}
            </For>
        </div>
    );
};

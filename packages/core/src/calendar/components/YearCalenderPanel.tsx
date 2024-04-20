import { genArray } from "@cn-ui/reactive";
import { debounce } from "radash";
import { For, createMemo } from "solid-js";
import { CalenderCtx } from "../Calendar";
import { CalendarYearCell } from "./DefaultCalendarCell";

export const YearCalenderPanel = () => {
    const calendarSystem = CalenderCtx.use();
    const yearList = createMemo(() => {
        const start = calendarSystem.targetDate().add(-4, "y");
        return genArray(12).map((i) => {
            return start.add(i, "y");
        });
    });
    const isYearView = createMemo(() => calendarSystem.calendarUnit() === "year");
    return (
        <div class="grid grid-cols-3">
            <For each={yearList()}>
                {(date) => {
                    return (
                        <div
                            class="p-2"
                            onmouseover={debounce(
                                {
                                    delay: 100,
                                },
                                () => {
                                    if (isYearView() && calendarSystem.isSelectingEnd())
                                        calendarSystem.virtualEndTime(date);
                                },
                            )}
                            onclick={() => {
                                if (isYearView()) {
                                    !calendarSystem.isInMonth(date) &&
                                        calendarSystem.targetDate((i) =>
                                            i.set("year", date.year()),
                                        );
                                    calendarSystem.toggleSelect(date);
                                } else {
                                    calendarSystem.targetDate((i) => i.set("year", date.year()));
                                    calendarSystem.calendarShowingType("month");
                                }
                            }}
                        >
                            <CalendarYearCell date={date} year={date.year()} />
                        </div>
                    );
                }}
            </For>
        </div>
    );
};

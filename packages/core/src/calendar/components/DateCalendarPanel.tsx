import { classNames, ensureFunctionResult, firstClass } from "@cn-ui/reactive";
import { debounce } from "radash";
import { For, createMemo } from "solid-js";
import { type CalendarProps, CalenderCtx } from "../Calendar";
import { CalendarDateCell } from "./DefaultCalendarCell";

export const DateCalendarPanel = (props: { Cell?: CalendarProps["Cell"] }) => {
    const calendarSystem = CalenderCtx.use();

    const dateGrid = createMemo(() => {
        const dates = calendarSystem.allDateInMonth();
        return [
            ...calendarSystem.extraStartWeek(),
            ...dates.paddingStart,
            ...dates.dayInMonth,
            ...dates.paddingEnd,
            ...calendarSystem.extraEndWeek(),
        ];
    });
    return (
        <div class="text-center">
            <div class="grid grid-cols-7  text-xs py-2">
                <For each={calendarSystem.weekHeader()}>
                    {(date) => {
                        return <div class={classNames("p-2")}>{date}</div>;
                    }}
                </For>
            </div>
            <div class="grid grid-cols-7">
                <For each={dateGrid()}>
                    {(date) => {
                        return (
                            <div
                                class={firstClass.base("p-0")(
                                    !calendarSystem.isInMonth(date) && "opacity-50",
                                    "",
                                )}
                                onmouseover={debounce({ delay: 100 }, () => {
                                    if (calendarSystem.isSelectingEnd())
                                        calendarSystem.virtualEndTime(date);
                                })}
                                onclick={() => {
                                    !calendarSystem.isInMonth(date) &&
                                        calendarSystem.targetDate((i) =>
                                            i.set("month", date.month()),
                                        );
                                    calendarSystem.toggleSelect(date);
                                }}
                            >
                                {ensureFunctionResult(props.Cell ?? CalendarDateCell, [
                                    { date, model: calendarSystem.selectedDate },
                                ])}
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};

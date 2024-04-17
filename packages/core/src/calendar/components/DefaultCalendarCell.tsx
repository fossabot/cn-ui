import { firstClass } from "@cn-ui/reactive";
import type { Dayjs } from "dayjs";
import { CalenderCtx } from "../Calendar";

export const CalendarDateCell = (props: { date: Dayjs }) => {
    const calendarSystem = CalenderCtx.use();
    const edgeDateClass = "bg-primary-50 text-primary-300 hover:text-primary-600 cn-selected";
    return (
        <div
            aria-label={props.date.format("YYYY MM DD")}
            role="button"
            aria-selected={calendarSystem.isSelected(props.date)}
            class={firstClass.base(
                "transition-colors cursor-pointer  w-8 h-8 flex justify-center items-center",
                calendarSystem.mode() !== "range" && "rounded-md",
            )(
                calendarSystem.isStartDate(props.date) && `${edgeDateClass} rounded-md`,
                calendarSystem.isEndDate(props.date) && `${edgeDateClass} rounded-r-md`,
                calendarSystem.isSelected(props.date) && edgeDateClass,
                "hover:bg-gray-100 rounded-md",
            )}
        >
            <div
                class={firstClass.base("")(
                    (calendarSystem.isEndDate(props.date) ||
                        calendarSystem.isStartDate(props.date)) &&
                        " w-6 h-6 rounded-full  bg-primary-600 text-design-pure",
                )}
            >
                {props.date.date()}
            </div>
        </div>
    );
};
export const CalendarMonthCell = (props: { date: Dayjs }) => {
    const calendarSystem = CalenderCtx.use();
    const edgeDateClass = "bg-primary-50 text-primary-300 hover:text-primary-600";
    return (
        <div
            aria-label={props.date.format("YYYY MM")}
            role="button"
            aria-selected={calendarSystem.isSelected(props.date, "month")}
            class={firstClass.base(
                "transition-colors cursor-pointer p-2 h-6 flex justify-center items-center w-full rounded-md",
            )(
                (calendarSystem.isStartDate(props.date, "month") ||
                    calendarSystem.isEndDate(props.date, "month")) &&
                    "bg-primary-50 text-primary-600 hover:text-primary-800",
                calendarSystem.isSelected(props.date, "month") && edgeDateClass,
                "hover:bg-gray-100",
            )}
        >
            {calendarSystem.monthHeader()[props.date.month()]}
        </div>
    );
};
export const CalendarYearCell = (props: { date: Dayjs; year: number }) => {
    const calendarSystem = CalenderCtx.use();
    const edgeDateClass = "bg-primary-50 text-primary-300 hover:text-primary-600";
    return (
        <div
            aria-label={props.date.format("YYYY")}
            role="button"
            aria-selected={calendarSystem.isSelected(props.date, "year")}
            class={firstClass.base(
                "transition-colors cursor-pointer p-2 h-6 flex justify-center items-center w-full rounded-md",
            )(
                (calendarSystem.isStartDate(props.date, "year") ||
                    calendarSystem.isEndDate(props.date, "year")) &&
                    "bg-primary-50 text-primary-600 hover:text-primary-800",
                calendarSystem.isSelected(props.date, "year") && edgeDateClass,
                "hover:bg-gray-100",
            )}
        >
            {props.year}
        </div>
    );
};

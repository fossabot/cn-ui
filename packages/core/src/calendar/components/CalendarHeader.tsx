import { AiOutlineDoubleLeft, AiOutlineLeft } from "solid-icons/ai";
import { Show, createMemo } from "solid-js";
import { Icon } from "../../icon";
import { CalenderCtx } from "../Calendar";

export function CalendarHeader() {
	const calendarSystem = CalenderCtx.use();
	const iconClass =
		"transition-colors cursor-pointer text-design-h2 hover:text-design-text";
	const isDayView = createMemo(
		() => calendarSystem.calendarShowingType() === "day",
	);
	const isYearView = createMemo(
		() => calendarSystem.calendarShowingType() === "year",
	);
	return (
		<div class="flex  py-2 border-b gap-1">
			<Icon
				onclick={() =>
					calendarSystem.targetDate((i) =>
						i.add(isYearView() ? -12 : -1, "year"),
					)
				}
				class={iconClass}
			>
				<AiOutlineDoubleLeft />
			</Icon>
			<Show when={isDayView()}>
				<Icon
					class={iconClass}
					onclick={() => calendarSystem.targetDate((i) => i.add(-1, "month"))}
				>
					<AiOutlineLeft />
				</Icon>
			</Show>
			<div class="flex-1 text-center">
				<Show
					when={calendarSystem.mode() === "range"}
					fallback={
						<>
							<span
								class="hover:text-primary-400 px-1 cursor-pointer"
								onclick={() => calendarSystem.calendarShowingType("year")}
							>
								{calendarSystem.targetDate().year()}
							</span>
							<Show when={calendarSystem.calendarShowingType() === "day"}>
								<span
									class="hover:text-primary-400 px-1 cursor-pointer"
									onclick={() => calendarSystem.calendarShowingType("month")}
								>
									{calendarSystem.targetDate().month() + 1}
								</span>
							</Show>
						</>
					}
				>
					{calendarSystem
						.selectedDate()
						.map((i) => i.format("YYYY MM"))
						.join(" - ")}
				</Show>
			</div>
			<Show when={calendarSystem.calendarShowingType() === "day"}>
				<Icon
					class={`${iconClass} rotate-180`}
					onclick={() => calendarSystem.targetDate((i) => i.add(1, "month"))}
				>
					<AiOutlineLeft />
				</Icon>
			</Show>
			<Icon
				onclick={() =>
					calendarSystem.targetDate((i) => i.add(isYearView() ? 12 : 1, "year"))
				}
				class={`${iconClass} rotate-180`}
			>
				<AiOutlineDoubleLeft />
			</Icon>
		</div>
	);
}

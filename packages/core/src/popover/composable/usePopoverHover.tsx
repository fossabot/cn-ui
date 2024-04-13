import { computed } from "@cn-ui/reactive";
import { type MaybeAccessor, useElementHover } from "solidjs-use";

export const usePopoverHover = (
	els: MaybeAccessor<EventTarget | null | undefined>[],
) => {
	const hoveringState = els.map((el) =>
		useElementHover(el, { delayLeave: 300 }),
	);
	const hovering = computed(() => hoveringState.some((i) => i()));
	return {
		hovering,
		hoveringState,
	};
};

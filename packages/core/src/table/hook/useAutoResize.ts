import { atom, computed } from "@cn-ui/reactive";
import { type Accessor, onCleanup, onMount } from "solid-js";
import { useResizeObserver } from "solidjs-use";

/** 自动根据父元素的大小变更自己的大小 */
export const useAutoResize = (ElRef: Accessor<HTMLElement | null>) => {
	const width$ = atom(0);
	const height$ = atom(0);

	const sizer = computed<HTMLElement | null>(() => ElRef()?.parentElement!);
	onMount(() => sizer.recomputed());

	let resizerStopper: ReturnType<typeof useResizeObserver>["stop"];
	onMount(() => {
		resizerStopper = useResizeObserver(sizer, ([entry]) => {
			const { width, height } = entry.contentRect;
			const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
				getComputedStyle(entry.target);

			const left = Number.parseInt(paddingLeft) || 0;
			const right = Number.parseInt(paddingRight) || 0;
			const top = Number.parseInt(paddingTop) || 0;
			const bottom = Number.parseInt(paddingBottom) || 0;

			width$(width - left - right);
			height$(height - top - bottom);
		}).stop;
	});

	onCleanup(() => {
		resizerStopper?.();
	});

	return {
		sizer,
		width: width$,
		height: height$,
	};
};

import { createEffect, onCleanup } from "solid-js";
import type { Atom } from "./atom";

export const createSync = <T, D>(
	a: Atom<T>,
	b: Atom<D>,
	AToB: (a: T) => D,
	BToA: (b: D) => T,
	config?: {
		aEqual?: (a: T) => boolean;
		bEqual?: (b: D) => boolean;
	},
) => {
	let cacheState: T | D | null;
	const aEqual = config?.aEqual ?? ((val) => val === cacheState);
	const bEqual = config?.bEqual ?? ((val) => val === cacheState);
	createEffect(() => {
		if (bEqual(b())) return;
		const newA = BToA(b());
		a(() => newA);
		cacheState = newA;
	});
	createEffect(() => {
		if (aEqual(a())) return;
		const newB = AToB(a());
		b(() => newB);
		cacheState = newB;
	});
	onCleanup(() => {
		cacheState = null;
	});
	return {
		/**
		 * @dev
		 */
		breakSync: () => {},
	};
};

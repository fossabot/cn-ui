import { debounce, throttle } from "radash";
import type { Accessor } from "solid-js";
import { atom } from "./atom";
import { useEffectWithoutFirst } from "./useEffect";

export function DebounceAtom<T>(a: Accessor<T>, debounceTime = 150) {
    const lastVal = a();
    const newA = atom(lastVal);
    useEffectWithoutFirst(
        debounce({ delay: debounceTime }, () => {
            const data = a();

            data !== undefined && newA(() => data as T);
        }),
        [a],
    );
    return newA;
}
export function ThrottleAtom<T>(a: Accessor<T>, debounceTime = 150) {
    const lastVal = a();
    const newA = atom(lastVal);
    useEffectWithoutFirst(
        throttle({ interval: debounceTime }, () => {
            const data = a();
            data !== undefined && newA(() => data as T);
        }),
        [a],
    );
    return newA;
}
export { throttle, debounce };

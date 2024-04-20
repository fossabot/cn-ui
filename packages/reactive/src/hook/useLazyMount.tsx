import { type Accessor, onMount } from "solid-js";
import { watch } from "solidjs-use";

/**
 * 一次性执行包装函数。
 */
function once<T extends (...args: any) => any>(originalFunction: T): T {
    let result: ReturnType<T>;
    let isExecuted = false;
    /** @ts-ignore */
    return function (...args) {
        if (!isExecuted) {
            /** @ts-ignore */
            result = originalFunction.apply(this, args);
            isExecuted = true;
        }

        return result;
    };
}

/** 在 Mount 之后进行懒初始化，初始化时机为 isReady 第一次 true */
export const useLazyMount = (
    fn: () => void,
    isReady: Accessor<boolean>,
    config: { onMountInit: boolean },
) => {
    const onceFn = once(fn);
    return onMount(() => {
        if (config.onMountInit || isReady()) {
            onceFn();
        } else {
            const cancel = watch(isReady, (val) => {
                if (val) {
                    onceFn();
                    cancel();
                }
            });
        }
    });
};

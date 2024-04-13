import { once } from "lodash-es";
import { type Accessor, onMount } from "solid-js";
import { watch } from "solidjs-use";

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

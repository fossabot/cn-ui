/**
 * @description: 滚动到指定位置,当第二个输入的函数返回 true 时，停止滚动；如果时间超过 maxScrollTime, 将会报错
 */
export const scrollElement = async (
    scrollElement: HTMLElement,
    predict: (
        scrollElement: HTMLElement,
        context: { getStep: () => number; reverse: () => void; slowDown: (diff: number) => void },
    ) => true | void | Promise<true | void>,
    {
        step = 16,
        horizontal = false,
        maxScrollTime = 3000,
    }: {
        step?: number;
        horizontal?: boolean;
        maxScrollTime?: number;
    } = {},
) => {
    const startTime = Date.now();
    // 判断元素到达底部
    do {
        const isVisible = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    predict(scrollElement, {
                        getStep() {
                            return step;
                        },
                        slowDown(diff) {
                            step - diff;
                        },
                        reverse() {
                            step = -step;
                        },
                    }),
                );
            }, 50);
        });
        if (isVisible) return;

        if (Date.now() - startTime > maxScrollTime) throw new Error("scroll long time");

        scrollElement[horizontal ? "scrollLeft" : "scrollTop"] += step;
    } while (
        horizontal
            ? scrollElement.scrollLeft < scrollElement.scrollWidth
            : scrollElement.scrollTop < scrollElement.scrollHeight
    );
    throw new Error("Cant find an element when scroll ");
};
/** 使用 IntersectionObserver 判断元素是否能被看到 */
export const isElementRealVisible = (element: Element) => {
    return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                observer.disconnect();
                if (entry.intersectionRatio === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        observer.observe(element);
    });
};

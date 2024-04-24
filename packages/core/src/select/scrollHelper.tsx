export const scrollIntoView = async (
    scrollElement: HTMLElement,
    predict: (
        scrollElement: HTMLElement,
        context: { reverse: () => void; slowDown: (diff: number) => void },
    ) => true | void | Promise<true | void>,
    {
        step = 16,
        horizontal = false,
    }: {
        step?: number;
        horizontal?: boolean;
    } = {},
) => {
    const startTime = Date.now();
    // 判断元素到达底部
    do {
        const isVisible = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    predict(scrollElement, {
                        slowDown(diff) {
                            step - diff;
                        },
                        reverse() {
                            step = -step;
                        },
                    }),
                );
            }, 0);
        });
        if (isVisible) return;

        if (Date.now() - startTime > 3000) throw new Error("scroll long time");

        scrollElement[horizontal ? "scrollLeft" : "scrollTop"] += step;
    } while (
        horizontal
            ? scrollElement.scrollLeft < scrollElement.scrollWidth
            : scrollElement.scrollTop < scrollElement.scrollHeight
    );
    throw new Error("Cant find an element when scroll ");
};
// 使用 IntersectionObserver 判断元素是否能被看到
export const isVisible = (element: Element) => {
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

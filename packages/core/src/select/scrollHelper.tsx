export const scrollIntoView = async (
    scrollElement: HTMLElement,
    /**
     *  1: 原速滚动
     *  0: 可见
     *  -1: 减速滚动
     */
    predict: (scrollElement: HTMLElement) => 1 | 0 | -1 | Promise<1 | -1 | 0>,
    {
        step = 16,
        to = "end",
        slowDownStep = 2,
    }: {
        to?: "start" | "end";
        step?: number;
        slowDownStep?: number;
    } = {},
) => {
    if (to === "start") step = -step;

    const startTime = Date.now();
    // 判断元素到达底部
    do {
        const isVisible = await new Promise<1 | -1 | 0>((resolve) => {
            setTimeout(() => {
                resolve(predict(scrollElement));
            }, 0);
        });
        switch (isVisible) {
            case 1:
                break;
            case -1:
                if (to === "start") {
                    step = step + slowDownStep;
                } else {
                    step = step - slowDownStep;
                }
                if (step <= 1) {
                    step = 1;
                }
                break;
            case 0:
                return;
        }
        if (Date.now() - startTime > 3000) throw new Error("scroll long time");
        scrollElement.scrollTop += step;
    } while (scrollElement.scrollTop < scrollElement.scrollHeight);
    throw new Error("Cant find an element when scroll ");
};
// 使用 IntersectionObserver 判断元素是否能被看到
export const isVisible = (element: HTMLElement) => {
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

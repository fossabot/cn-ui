/**
 * 基于 requestAnimationFrame 的防抖函数
 */
export function rAFDebounce<T extends (...args: any[]) => any>(fn: T): T {
    let scheduled = false;
    let animationFrameId = 0; // 初始化动画帧 ID

    function debounced(...args: Parameters<T>): void {
        if (scheduled) {
            cancelAnimationFrame(animationFrameId); // 取消已安排的动画帧请求
        }
        animationFrameId = requestAnimationFrame(() => {
            scheduled = false;
            fn(...args);
        });
        scheduled = true;
    }

    return debounced as any as T;
}

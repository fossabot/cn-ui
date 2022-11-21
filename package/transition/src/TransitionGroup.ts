import { delay } from 'lodash-es';
import {
    createSignal,
    createComputed,
    createEffect,
    createMemo,
    Component,
    children,
    splitProps,
} from 'solid-js';
import { nextFrame } from './nextFrame';
type BoundingRect = {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
};

type ElementInfo = {
    pos: BoundingRect;
    newPos?: BoundingRect;
    new?: boolean;
    moved?: boolean;
};

function getRect(element: Element): BoundingRect {
    const { top, bottom, left, right, width, height } = element.getBoundingClientRect();

    const parentRect = (element.parentNode! as Element).getBoundingClientRect();
    return {
        top: top - parentRect.top,
        bottom,
        left: left - parentRect.left,
        right,
        width,
        height,
    };
}

export type TransitionGroupProps = {
    name?: string;
    /** 每个元素延迟的时间 */
    stagger?: number;
    enterActiveClass?: string;
    enterClass?: string;
    enterToClass?: string;
    exitActiveClass?: string;
    exitClass?: string;
    exitToClass?: string;
    moveClass?: string;
    onBeforeEnter?: (el: Element) => void;
    onEnter?: (el: Element, done: () => void) => void;
    onAfterEnter?: (el: Element) => void;
    onBeforeExit?: (el: Element) => void;
    onExit?: (el: Element, done: () => void) => void;
    onAfterExit?: (el: Element) => void;
    children?: any;
    appear?: boolean;
};
export const TransitionGroup: Component<TransitionGroupProps> = (props) => {
    const resolved = children(() => props.children);
    // fixed: 修补没有用到的类
    const [ClassNames] = splitProps(props, [
        'enterActiveClass',
        'enterClass',
        'enterToClass',
        'exitActiveClass',
        'exitClass',
        'exitToClass',
        'moveClass',
    ]);
    const classnames = createMemo(() => {
        const name = props.name || 's';
        return Object.assign(
            {
                enterActiveClass: name + '-enter-active',
                enterClass: name + '-enter',
                enterToClass: name + '-enter-to',
                exitActiveClass: name + '-exit-active',
                exitClass: name + '-exit',
                exitToClass: name + '-exit-to',
                moveClass: name + '-move',
            },
            ClassNames
        );
    });
    const { onBeforeEnter, onEnter, onAfterEnter, onBeforeExit, onExit, onAfterExit } = props;
    const [combined, setCombined] = createSignal<Element[]>();
    let p: Element[] = [];
    let first = true;
    createComputed(() => {
        const c = resolved() as Element[];
        const comb = [...c];
        const next = new Set(c);
        const prev = new Set(p);
        const enterClasses = classnames().enterClass!.split(' ');
        const enterActiveClasses = classnames().enterActiveClass!.split(' ');
        const enterToClasses = classnames().enterToClass!.split(' ');
        const exitClasses = classnames().exitClass!.split(' ');
        const exitActiveClasses = classnames().exitActiveClass!.split(' ');
        const exitToClasses = classnames().exitToClass!.split(' ');
        for (let i = 0; i < c.length; i++) {
            const el = c[i];
            // fixed: 添加 appear 第一次动画渲染
            if ((!first || props.appear) && !prev.has(el) && el) {
                // 优先进行初始化类名的注入
                el.classList.add(...enterClasses);
                delay(() => {
                    onBeforeEnter && onBeforeEnter(el);

                    el.classList.add(...enterActiveClasses);
                    nextFrame(() => {
                        el.classList.remove(...enterClasses);
                        el.classList.add(...enterToClasses);
                        onEnter && onEnter(el, () => endTransition());
                        if (!onEnter || onEnter.length < 2) {
                            el.addEventListener('transitionend', endTransition);
                            el.addEventListener('animationend', endTransition);
                        }
                    });
                    function endTransition(e?: Event) {
                        if (el && (!e || e.target === el)) {
                            el.removeEventListener('transitionend', endTransition);
                            el.removeEventListener('animationend', endTransition);
                            el.classList.remove(...enterActiveClasses);
                            el.classList.remove(...enterToClasses);
                            onAfterEnter && onAfterEnter(el);
                        }
                    }
                }, i * props.stagger);
            }
        }
        for (let i = 0; i < p.length; i++) {
            const old = p[i];
            if (old && !next.has(old) && old.parentNode) {
                comb.splice(i, 0, old);
                old.classList.add(...exitClasses);
                delay(() => {
                    onBeforeExit && onBeforeExit(old);
                    old.classList.add(...exitActiveClasses);
                    nextFrame(() => {
                        old.classList.remove(...exitClasses);
                        old.classList.add(...exitToClasses);
                    });
                    onExit && onExit(old, () => endTransition());
                    if (!onExit || onExit.length < 2) {
                        old.addEventListener('transitionend', endTransition);
                        old.addEventListener('animationend', endTransition);
                    }

                    function endTransition(e?: Event) {
                        if (!e || e.target === old) {
                            old.removeEventListener('transitionend', endTransition);
                            old.removeEventListener('animationend', endTransition);
                            old.classList.remove(...exitActiveClasses);
                            old.classList.remove(...exitToClasses);
                            onAfterExit && onAfterExit(old);
                            p = p.filter((i) => i !== old);
                            setCombined(p);
                        }
                    }
                }, i * props.stagger);
            }
        }
        p = comb;
        setCombined(comb);
    });

    createEffect<Map<Element, ElementInfo>>((nodes) => {
        const c = combined();
        c.forEach((child) => {
            let n: ElementInfo | undefined = nodes.get(child);
            if (!n) {
                try {
                    // 这里查找的时候会发生 BUG
                    n = { pos: getRect(child), new: !first };
                } catch (e) {
                    return;
                }
                nodes.set(child, n);
            } else if (n.new) {
                n.new = false;
                n.newPos = getRect(child);
            }
            if (n.new) {
                child.addEventListener(
                    'transitionend',
                    () => {
                        n!.new = false;
                        child.parentNode && (n!.newPos = getRect(child));
                    },
                    { once: true }
                );
            }
            n.newPos && (n.pos = n.newPos);
            n.newPos = getRect(child);
        });
        if (first) {
            first = false;
            return nodes!;
        }
        c.forEach((child) => {
            const c = nodes!.get(child)!;
            if (!c) return;
            const oldPos = c.pos;
            const newPos = c.newPos!;
            const dx = oldPos.left - newPos.left;
            const dy = oldPos.top - newPos.top;
            if (dx || dy) {
                c.moved = true;
                const s = (child as HTMLElement | SVGElement).style;
                s.transform = `translate(${dx}px,${dy}px)`;
                s.transitionDuration = '0s';
            }
        });
        document.body.offsetHeight;
        c.forEach((child) => {
            const c = nodes!.get(child)!;
            if (!c) return;
            if (c.moved) {
                c.moved = false;
                const s = (child as HTMLElement | SVGElement).style;
                const moveClasses = classnames().moveClass!.split(' ');
                child.classList.add(...moveClasses);
                s.transform = s.transitionDuration = '';
                function endTransition(e: TransitionEvent) {
                    if ((e && e.target !== child) || !child.parentNode) return;
                    if (!e || /transform$/.test(e.propertyName)) {
                        (child as HTMLElement | SVGElement).removeEventListener(
                            'transitionend',
                            endTransition as EventListener
                        );
                        child.classList.remove(...moveClasses);
                    }
                }
                (child as HTMLElement | SVGElement).addEventListener(
                    'transitionend',
                    endTransition as EventListener
                );
            }
        });
        return nodes!;
    }, new Map());
    return combined;
};

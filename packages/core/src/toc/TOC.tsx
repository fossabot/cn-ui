import { OriginComponent, classNames, useMapper } from "@cn-ui/reactive";

export interface TOCHeadingType {
    /** heading 深度 */
    depth: number;
    /** 文字标题 */
    text: string;
    /** 跳转地址 */
    slug: string;
}

export const TOCHeading = (props: { heading: TOCHeadingType }) => {
    const depth = useMapper(() => props.heading.depth as 1 | 2 | 3, {
        1: "indent-sm",
        2: "indent-md",
        3: "indent-lg",
    });
    return (
        <li
            class={classNames(
                depth(),
                "text-nowrap text-ellipsis overflow-hidden hover:opacity-100 transition-opacity",
            )}
        >
            <a href={`#${props.heading.slug}`}>{props.heading.text}</a>
        </li>
    );
};

/** TOC 组件 */
export const TOC = OriginComponent<{ headings: TOCHeadingType[] }>((props) => {
    return (
        <nav
            class={props.class(props, "opacity-70 hover:opacity-50 transition-opacity")}
            style={{ ...props.style() }}
            ref={props.ref}
        >
            <ul>
                {props.headings
                    .filter((heading) => heading.depth <= 3)
                    .map((heading) => (
                        <TOCHeading heading={heading} />
                    ))}
            </ul>
        </nav>
    );
});

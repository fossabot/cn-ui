import { OriginComponent, OriginDiv, extendsEvent, useMapper } from "@cn-ui/reactive";

interface ContainerProps {
    direction?: "row" | "col";
}

export const Container = OriginComponent<ContainerProps>((props) => {
    const direction = useMapper(() => props.direction ?? "col", {
        row: "flex-row",
        col: "flex-col",
    });
    return (
        <section
            class={props.class(" w-full flex ", direction())}
            style={props.style()}
            {...extendsEvent(props)}
        >
            {props.children}
        </section>
    );
});

export const Main = OriginComponent((props) => {
    return (
        <main
            class={props.class("block flex-1 p-5")}
            style={props.style()}
            {...extendsEvent(props)}
        >
            {props.children}
        </main>
    );
});
export const Header = OriginComponent<{
    height?: string;
}>((props) => {
    return (
        <header
            class={props.class("px-5")}
            style={{ ...props.style(), height: props.height }}
            {...extendsEvent(props)}
        >
            {props.children}
        </header>
    );
});
export const Aside = OriginComponent<{ width?: string }>((props) => {
    return (
        <aside
            class={props.class("flex-none")}
            style={{ ...props.style(), width: props.width }}
            {...extendsEvent(props)}
        >
            {props.children}
        </aside>
    );
});
export const Footer = OriginComponent<{
    height?: string;
}>((props) => {
    return (
        <footer
            class={props.class("px-5")}
            style={{ ...props.style(), height: props.height }}
            {...extendsEvent(props)}
        >
            {props.children}
        </footer>
    );
});

export const Center = OriginComponent((props) => {
    return (
        <OriginDiv prop={props} class="h-full flex justify-center items-center">
            {props.children}
        </OriginDiv>
    );
});

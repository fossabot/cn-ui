import { useMapper } from "@cn-ui/reactive";
import type { ButtonProps } from "../Button";

export function createDisabledClass(props: Partial<Pick<ButtonProps, "type" | "danger">>) {
    const common = "opacity-50 border-design-disabled";
    return useMapper(() => props.type ?? "default", {
        primary() {
            return `${common} bg-design-disabled`;
        },
        dashed() {
            return `${this.default()} border-dashed`;
        },
        link() {
            const danger = props.danger ? "text-error-500" : "text-primary-500";
            return `${this.default()} border-none ${danger}`;
        },
        text() {
            return this.link();
        },
        default: () => {
            return ` cursor-not-allowed bg-transparent ${common}`;
        },
    });
}

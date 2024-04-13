import { Show } from "solid-js";
import { Portal } from "solid-js/web";

export function PortalEasy(
	props: { portalled?: boolean } & Parameters<typeof Portal>[0],
) {
	return (
		<Show when={props.portalled} fallback={props.children}>
			<Portal {...props}></Portal>
		</Show>
	);
}

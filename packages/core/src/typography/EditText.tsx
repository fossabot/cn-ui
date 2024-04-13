import { OriginComponent, extendsEvent } from "@cn-ui/reactive";
import { NullAtom } from "@cn-ui/reactive";
import copy from "copy-to-clipboard";
import { AiOutlineCopy } from "solid-icons/ai";
import type { JSXElement } from "solid-js";
import { Icon } from "../icon";
import "./style/edit.css";

export interface EditContentProps {
	children: JSXElement;
}
export const CopyText = OriginComponent<EditContentProps>((props) => {
	const container = NullAtom<HTMLSpanElement>(null);
	return (
		<span
			ref={props.ref}
			class={props.class()}
			style={props.style()}
			{...extendsEvent(props)}
		>
			<span ref={container!}>{props.children}</span>
			<Icon
				class="edit-text-icon"
				onClick={() => {
					if (container())
						copy(container()!.textContent!, { format: "text/plain" });
				}}
				color="green"
			>
				<AiOutlineCopy />
			</Icon>
		</span>
	);
});
